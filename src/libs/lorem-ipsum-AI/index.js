import {PythonShell} from 'python-shell';
import dataSchema from './metaData'
import mongoose from 'mongoose';


const metaDataModel = new mongoose.model('videoMeta', dataSchema);



export async function createMeta(metaData, ctx) {
 await metaDataModel.create(metaData, (err, data) => {
     if(err) console.log(err);
     else {
        console.log(data + '\nwas Add in the db');  
        initCheck(data._id, ctx);
     }
 })
}

async function initCheck(id, ctx) {
    return metaDataModel.findOne({_id: id}, (err, data) => {
        if(err) console.log(err);
        let options = {
            mode: 'text',
            args: [data.path],
            pythonOptions: ['-u'],
            scriptPath: '../lorem-ipsum-AI'
        }
        return PythonShell.run('main.py', options, function (err, results) {
            if (err) throw err;
             results = results.toString();
             results = results.split('©')
             results = results[1];
             results = results.split('|');
             let resultsAudio = StringToArray(results[1]);
             let resultsVideo = StringToArray(results[0]);
             let verdictVideo =  checkVideo(resultsVideo);
             let verdictAudio =  checkVideo(resultsAudio);
             console.log('VERDICT VIDEO' + verdictVideo);
             console.log('VERDICT AUDIO' + verdictAudio);
             if (verdictVideo === false || verdictAudio === false) {
                metaDataModel.findOneAndUpdate({_id: id}, {status: false}, (err) => {
                    if(err) console.log(err);
                })
            }
           });

    })
}

function StringToArray(text) {
    text = text.replace(/[.,/]/g, '');
    text = text.replace(/\[|\]/g, '');
    text = text.replace(/'/g, '');
    text = text.split(' ');
    return text;
}

function checkVideo(checkArray) {
        if(checkArray[0] === undefined) return true;
        let blacklist = ['wine', 'glass'];
        let bool = true;
        for(let i = 0; i < checkArray.length; i++) {
            for(let j = 0; j < blacklist.length; j++) {
                if(checkArray[i] == blacklist[j]) {
                    bool = false; 
                    break;
                }
            }
        }
    return bool;  
}