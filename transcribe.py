from pydub import AudioSegment
import speech_recognition as sr
import sys

file_path = r'C:\Users\moses\.gemini\antigravity-ide\brain\f4ae7b1c-66e6-4d05-9313-072aea75e9a4\uploaded_media_1781744238532.img'
wav_path = 'temp.wav'

try:
    AudioSegment.from_file(file_path).export(wav_path, format='wav')
    r = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio_data = r.record(source)
        print(r.recognize_google(audio_data))
except Exception as e:
    print(f'Error: {e}')
