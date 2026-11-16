#!/bin/bash
# Prepares the short clip of a product page (FK-38) from a phone or studio video.
# Usage: bash scripts/encode-product-video.sh <video> [output folder]
# Writes three files next to each other:
#   <name>-av1.mp4      AV1, the light format (about 40 % smaller than H.264 at the same quality)
#   <name>-h264.mp4     H.264, played by the phones that cannot decode AV1
#   <name>-affiche.jpg  the still image shown before the customer asks for the video
# Upload them to the media library, then paste their addresses in the product metadata
# of the Medusa admin: video_av1, video_mp4, video_poster.
# The clip is cut to 10 s, 480 px wide, without sound. Needs ffmpeg with libsvtav1 and libx264.
set -euo pipefail

input="${1:?Usage: bash scripts/encode-product-video.sh <video> [output folder]}"
out="${2:-$(dirname "$input")}"
name="$(basename "${input%.*}")"
common=(-an -t 10 -vf "scale=480:-2" -pix_fmt yuv420p -movflags +faststart -loglevel error -y)

ffmpeg -i "$input" "${common[@]}" -c:v libsvtav1 -preset 4 -crf 45 "$out/$name-av1.mp4"
ffmpeg -i "$input" "${common[@]}" -c:v libx264 -preset slow -crf 28 "$out/$name-h264.mp4"
ffmpeg -loglevel error -y -i "$input" -vf "scale=480:-2" -frames:v 1 -q:v 5 "$out/$name-affiche.jpg"

for file in "$out/$name-av1.mp4" "$out/$name-h264.mp4" "$out/$name-affiche.jpg"; do
  size=$(( $(wc -c < "$file") / 1024 ))
  echo "$(basename "$file") : ${size} Ko"
  # FK-38 budget: the clip stays around 500 Ko so a product page remains light on mobile data.
  if [ "$size" -gt 500 ]; then echo "  Attention : plus de 500 Ko, raccourcissez la vidéo."; fi
done
