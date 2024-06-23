let cacheData = 'appV1'
this.addEventListener('install', (event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/',
                '/static/js/bundle.js',
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
            ])
        })
    )
})



this.addEventListener('fetch', (event)=>{
    if(!navigator.onLine){
        event.respondWith(
            caches.match(event.request).then((resp)=>{
                if(resp){
                    return resp
                }
            })
        )
    }
    
})