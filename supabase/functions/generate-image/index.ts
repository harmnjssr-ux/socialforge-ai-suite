import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, aspectRatio, companyId, count } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get auth user from request
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Build enhanced prompt
    let enhancedPrompt = prompt;
    if (style) enhancedPrompt += `, ${style} style`;
    if (aspectRatio) enhancedPrompt += `, ${aspectRatio} aspect ratio`;

    const imageCount = Math.min(count || 1, 4);
    const imageUrls: string[] = [];

    for (let i = 0; i < imageCount; i++) {
      const response = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `Generate a high-quality professional image: ${enhancedPrompt}`,
              },
            ],
            modalities: ["image", "text"],
          }),
        }
      );

      if (!response.ok) {
        const status = response.status;
        if (status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (status === 402) {
          return new Response(
            JSON.stringify({ error: "Usage limit reached. Please add credits." }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error(`AI gateway error: ${status}`);
      }

      const data = await response.json();
      const imageData = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (imageData) {
        // Upload to storage
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const bytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const fileName = `${companyId}/images/${crypto.randomUUID()}.png`;

        const { error: uploadError } = await supabaseClient.storage
          .from("media-library")
          .upload(fileName, bytes, { contentType: "image/png" });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Still return the base64 URL as fallback
          imageUrls.push(imageData);
        } else {
          const { data: publicUrl } = supabaseClient.storage
            .from("media-library")
            .getPublicUrl(fileName);
          imageUrls.push(publicUrl.publicUrl);

          // Save to media_assets
          await supabaseClient.from("media_assets").insert({
            company_id: companyId,
            type: "image",
            url: publicUrl.publicUrl,
            prompt,
            platform_preset: aspectRatio,
            style,
          });
        }
      }
    }

    return new Response(JSON.stringify({ images: imageUrls }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
