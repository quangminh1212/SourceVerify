const fs = require('fs'), path = require('path');
const EXTRA = {
    lpq_analysis: 2012, frame_drop: 2019, blink_rate: 2020, video_noise: 2017, skin_texture: 2021,
    hair_detail: 2021, eye_reflection: 2020, jawline: 2021, ear_symmetry: 2020, expression: 2020,
    teeth: 2021, eyebrow: 2022, shoulder: 2021, bg_perspective: 2019, watermark: 2018,
    motion_vector: 2017, head_pose_v2: 2020, micro_expression_v2: 2019, face_alignment_v: 2019,
    bokeh: 2021, lens_distortion_v: 2019, stabilization: 2020, pixel_repetition_v: 2021,
    video_hash: 2018, color_quant_v: 2017, texture_flow: 2020, video_grain: 2018
};
const dp = path.join(__dirname, '..', 'src', 'app', 'methods', 'data.ts');
let c = fs.readFileSync(dp, 'utf8');
for (const [id, year] of Object.entries(EXTRA)) {
    const re = new RegExp(`(\\{\\s*id:\\s*"${id}"[^}]*weight:\\s*[\\d.]+)\\s*\\}`);
    const m = c.match(re);
    if (m) { c = c.replace(m[0], `${m[1]}, year: ${year} }`); console.log(`✅ ${id} → ${year}`); }
    else console.log(`⚠️ ${id}`);
}
fs.writeFileSync(dp, c);
const ym = c.match(/year:\s*\d{4}/g);
console.log(`Total with year: ${ym ? ym.length : 0}`);
