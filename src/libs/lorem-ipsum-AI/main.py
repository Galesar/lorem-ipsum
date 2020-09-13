from imageai.Detection import VideoObjectDetection
import importlib
spere=importlib.import_module('spere')
import os
import sys
from moviepy.editor import *
from collections import Counter

text_finally=''

def GetObjectsList(name,expansion):
    
    video=VideoFileClip(f"{path}.{expansion}")
    video=video.set_fps(1)
    video=video.without_audio()
    video=video.fx(vfx.speedx,5)
    video.write_videofile(f"{name}_temp.{expansion}")



    ListObjects=[]
    def forFrame(frame_number, output_array, output_count):
        
        for k in output_array:
            if k["name"] in ListObjects:
                pass
            else:
                ListObjects.append(k["name"])
        
        



    video_detector = VideoObjectDetection()
    video_detector.setModelTypeAsYOLOv3()
    video_detector.setModelPath("../lorem-ipsum-AI/yolo.h5")
    video_detector.loadModel()


    video_detector.detectObjectsFromVideo(input_file_path=f"{name}_temp.{expansion}", save_detected_video=False, per_frame_function=forFrame,  minimum_percentage_probability=70,log_progress=False,display_percentage_probability=False)
    os.remove(f"{name}_temp.{expansion}")
    return ListObjects
    



def GetVideoSubtitles(name):
    global audio
    
    audio=AudioFileClip(f"{name}")
    AudioSubtitles=''
    i=0
    j=0
    k=90
    if audio.duration>90:
        for a in range (int(audio.duration//90)):
            if i<(audio.duration//90):
                audioclip=audio.subclip(j,k)
                audioclip.write_audiofile(f"{name}"+"_tempAudio.wav")
                
                AudioSubtitles=AudioSubtitles+SpeechToText(name)
            else:
                audioclip=audio.subclip(j,audio.duration)
                audioclip.write_audiofile(f"{name}"+"_tempAudio.wav")
                
                AudioSubtitles=AudioSubtitles+SpeechToText(name)
            j=j+90
            k=k+90
            i=i+1
    else:
        audio.write_audiofile(f"{name}"+"_tempAudio.wav")
    
    return(AudioSubtitles)  



def SpeechToText(name):
    sample_audio = spere.AudioFile(f"{name}_tempAudio"+".wav")
    recog=spere.Recognizer()
    with sample_audio as audio_file:
        audio_content = recog.record(audio_file)
    
    #print(recog.recognize_google(audio_content, language='ru-RU', show_all=True))
    a=recog.recognize_google(audio_content, language='ru-RU', show_all=False)
    temp_text=''
    for i in a:
        temp_text=temp_text+str(i)
    
    return temp_text


def count_words_fast (subtitles):
    
    
    subtitles.lower()
    
    skips = [".", ",", ":", ";", "'", '"']
    for ch in skips:
        subtitles = subtitles.replace(ch, "")
    word_counts = Counter(subtitles.split(" "))

    
    return dict(word_counts)
    
def ListWords(name,expansion):
    
    name=f'{path}.{expansion}'
    a=(count_words_fast(GetVideoSubtitles(name)))

    listofTuples = sorted(a.items() , reverse=True, key=lambda x: x[1])
    # Iterate over the sorted sequence
    temp_array=[]
    for elem in listofTuples :
        if(len(elem[0])>3):
            temp_array.append(elem[0])
    result_array=[]  
    for i in range(len(temp_array)):
        if i <4:
            result_array.append(temp_array[i])
        else:
            break

    return result_array



path_temp=sys.argv[1]
expansion=path_temp.split('.')[1]
path=path_temp.split('.')[0]
one=GetObjectsList(path,expansion)
two=ListWords(path,expansion)


print(f"\n\n©{one}|{two}©\n\n")
