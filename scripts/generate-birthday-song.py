import math
import struct
import wave

SAMPLE_RATE = 44100

def get_freq(note_name):
    notes = {
        'C3': 130.81, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
        'C6': 1046.50
    }
    return notes.get(note_name, 440.0)

# Total duration ~26 seconds for one loop + 4 seconds reverb tail = 30 seconds
BPM = 72
BEAT = 60.0 / BPM # ~0.833s

melody = [
    # (time_in_beats, note, duration_in_beats, volume)
    # Phrase 1: Happy birthday to you
    (1.0, 'G4', 0.75, 0.7),
    (1.75, 'G4', 0.25, 0.6),
    (2.0, 'A4', 1.0, 0.8),
    (3.0, 'G4', 1.0, 0.8),
    (4.0, 'C5', 1.0, 0.9),
    (5.0, 'B4', 2.0, 0.85),

    # Phrase 2: Happy birthday to you
    (7.0, 'G4', 0.75, 0.7),
    (7.75, 'G4', 0.25, 0.6),
    (8.0, 'A4', 1.0, 0.8),
    (9.0, 'G4', 1.0, 0.8),
    (10.0, 'D5', 1.0, 0.9),
    (11.0, 'C5', 2.0, 0.85),

    # Phrase 3: Happy birthday dear Hridyansh
    (13.0, 'G4', 0.75, 0.7),
    (13.75, 'G4', 0.25, 0.6),
    (14.0, 'G5', 1.0, 0.95),
    (15.0, 'E5', 1.0, 0.9),
    (16.0, 'C5', 1.0, 0.85),
    (17.0, 'B4', 1.0, 0.8),
    (18.0, 'A4', 2.0, 0.85),

    # Phrase 4: Happy birthday to you
    (20.0, 'F5', 0.75, 0.9),
    (20.75, 'F5', 0.25, 0.75),
    (21.0, 'E5', 1.0, 0.9),
    (22.0, 'C5', 1.0, 0.85),
    (23.0, 'D5', 1.0, 0.9),
    (24.0, 'C5', 3.0, 0.95),
]

# Gentle music box arpeggio accompaniment
accompaniment = [
    # Measure 1
    (1.0, 'C4', 1.0, 0.35),
    (1.5, 'E4', 1.0, 0.3),
    (2.0, 'G4', 1.0, 0.3),
    (3.0, 'E4', 1.0, 0.3),
    (4.0, 'C4', 1.0, 0.35),
    (5.0, 'G3', 1.0, 0.35),
    (5.5, 'D4', 1.0, 0.3),
    (6.0, 'G4', 1.0, 0.3),

    # Measure 2
    (7.0, 'G3', 1.0, 0.35),
    (7.5, 'D4', 1.0, 0.3),
    (8.0, 'G4', 1.0, 0.3),
    (9.0, 'B3', 1.0, 0.3),
    (10.0, 'G3', 1.0, 0.35),
    (11.0, 'C4', 1.0, 0.35),
    (11.5, 'E4', 1.0, 0.3),
    (12.0, 'G4', 1.0, 0.3),

    # Measure 3
    (13.0, 'C4', 1.0, 0.35),
    (13.5, 'E4', 1.0, 0.3),
    (14.0, 'G4', 1.0, 0.35),
    (15.0, 'C4', 1.0, 0.35),
    (16.0, 'E4', 1.0, 0.3),
    (17.0, 'C4', 1.0, 0.3),
    (18.0, 'F3', 1.0, 0.4),
    (18.5, 'C4', 1.0, 0.3),
    (19.0, 'A4', 1.0, 0.35),

    # Measure 4
    (20.0, 'F3', 1.0, 0.4),
    (20.5, 'C4', 1.0, 0.3),
    (21.0, 'A4', 1.0, 0.35),
    (22.0, 'C4', 1.0, 0.35),
    (22.5, 'E4', 1.0, 0.3),
    (23.0, 'G3', 1.0, 0.35),
    (23.5, 'D4', 1.0, 0.3),
    (24.0, 'C3', 2.0, 0.45),
    (24.5, 'G3', 2.0, 0.35),
    (25.0, 'C4', 2.0, 0.35),
    (25.5, 'E4', 2.0, 0.35),
]

total_beats = 28
total_seconds = total_beats * BEAT + 2.0
total_samples = int(SAMPLE_RATE * total_seconds)

# Stereo buffers
left = [0.0] * total_samples
right = [0.0] * total_samples

def add_music_box_note(start_time_s, freq, duration_s, amp, pan=0.0):
    start_sample = int(start_time_s * SAMPLE_RATE)
    # Music box chime lasts up to 2.5s with decay
    note_samples = int(min(2.5, total_seconds - start_time_s) * SAMPLE_RATE)
    if start_sample >= total_samples:
        return

    # Stereo gains
    gain_l = amp * math.cos((pan + 1.0) * math.pi / 4.0)
    gain_r = amp * math.sin((pan + 1.0) * math.pi / 4.0)

    for i in range(note_samples):
        idx = start_sample + i
        if idx >= total_samples:
            break
        t = i / SAMPLE_RATE

        # Attack (fast 3ms)
        attack = min(1.0, t / 0.003)
        # Decay (exponential)
        decay = math.exp(-t / 0.75)
        env = attack * decay

        # Harmonics for music box / celesta chime:
        # fundamental + bell overtones (non-integer harmonics give metal chime timbre)
        s1 = math.sin(2.0 * math.pi * freq * t)
        s2 = 0.35 * math.sin(2.0 * math.pi * freq * 2.76 * t)
        s3 = 0.20 * math.sin(2.0 * math.pi * freq * 5.40 * t)
        s4 = 0.15 * math.sin(2.0 * math.pi * freq * 2.00 * t)
        s5 = 0.08 * math.sin(2.0 * math.pi * freq * 8.93 * t)

        val = (s1 + s2 + s3 + s4 + s5) * env

        left[idx] += val * gain_l
        right[idx] += val * gain_r

# Render melody (panned slightly center-right)
for beat, note, dur, vol in melody:
    freq = get_freq(note)
    # slight pan variation based on pitch
    pan = (freq - 440.0) / 600.0
    pan = max(-0.5, min(0.5, pan))
    add_music_box_note(beat * BEAT, freq, dur * BEAT, vol * 0.45, pan)

# Render accompaniment (panned slightly center-left)
for beat, note, dur, vol in accompaniment:
    freq = get_freq(note)
    pan = -0.3 + (freq - 260.0) / 800.0
    add_music_box_note(beat * BEAT, freq, dur * BEAT, vol * 0.32, pan)

# Add a dreamy delay / reverb
delay_samples = int(SAMPLE_RATE * 0.28)
feedback = 0.25
for i in range(delay_samples, total_samples):
    left[i] += right[i - delay_samples] * feedback
    right[i] += left[i - delay_samples] * feedback

# Normalize
max_val = max(max(abs(x) for x in left), max(abs(x) for x in right), 0.001)
scale = 0.85 / max_val

output_wav = "public/birthday-song.wav"
with wave.open(output_wav, "w") as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2) # 16-bit
    wav_file.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(total_samples):
        l_val = max(-32767, min(32767, int(left[i] * scale * 32767)))
        r_val = max(-32767, min(32767, int(right[i] * scale * 32767)))
        frames.extend(struct.pack('<hh', l_val, r_val))
    
    wav_file.writeframes(frames)

print(f"Generated {output_wav} ({len(frames)} bytes, {total_seconds:.1f}s)")
