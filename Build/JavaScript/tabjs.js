at.on('alphaTab.soundFontLoad', function(e, progress) {
            var percentage = ((progress.loaded / progress.total) * 100)|0;
            $('#soundFontProgress').css('width', percentage + '%').text(percentage + '%');
        });
        at.on('alphaTab.soundFontLoaded', function() {
            $('#soundFontProgressMenuItem').hide();
        });
        at.on('alphaTab.playerReady', function() {
            $('#loadingInfo').hide();
            $('#playPause').prop('disabled', false).removeAttr('disabled');            
            $('#stop').prop('disabled', false).removeAttr('disabled');            
            $('#looping').prop('disabled', false).removeAttr('disabled');            
            $('#metronome').prop('disabled', false).removeAttr('disabled');            
            updateControls();
        });
        at.on('alphaTab.playerStateChanged', function() {
            updateControls();
        });
        
        at.alphaTab(); 
               
        $('#print').click(function() { 
            at.alphaTab('print');
        });
        
        $('#playPause').click(function() { 
            at.alphaTab('playPause');
        });
        
        $('#stop').click(function() { 
            at.alphaTab('stop');
        });
        
        $('#looping').click(function(e) {
            e.preventDefault();
            var looping = !at.alphaTab('loop');
            at.alphaTab('loop', looping);
            if(looping) {
                $('#looping').closest('li').addClass('active');
            }
            else {
                $('#looping').closest('li').removeClass('active');
            }
        });
        
        $('#metronome').click(function(e) {
            e.preventDefault();
            var metronomeVolume = at.alphaTab('metronomeVolume');
            if(metronomeVolume == 0) {
                at.alphaTab('metronomeVolume', 1);
                $('#metronome').closest('li').addClass('active');
            }
            else {
                at.alphaTab('metronomeVolume', 0);
                $('#metronome').closest('li').removeClass('active');
            }
        });
        
        $('#playbackSpeedSelector a').click(function() {
            var playbackSpeed = $(this).data('value');
            at.alphaTab('playbackSpeed', playbackSpeed);
            $('#playbackSpeed').text($(this).text());
        }); 
        
        function updateControls() {
            var playerState = at.alphaTab('playerState');
            switch(playerState) {
                case 0: // stopped/paused
                $('#playPause').removeClass('glyphicon-pause').addClass('glyphicon-play');
                break;
                case 1: // playing
                $('#playPause').removeClass('glyphicon-play').addClass('glyphicon-pause');
                break;
            }
        }     
        
        $('a[data-layout]').click(function(e) {
            $('a[data-layout]').closest('li').removeClass('active');
            $(this).closest('li').addClass('active');
            
            e.preventDefault();
            
            var layout = $(this).data('layout');
            var scrollmode = $(this).data('scrollmode');
            
            at.removeClass('horizontal page');
            at.addClass(layout);
            at.alphaTab('layout', layout);
            at.alphaTab('autoScroll', scrollmode);
            $('body,html').animate({
                scrollTop: 0 
            }, 300);
        });
    
        var tracks = [];
        $('#trackList').on('click', function(e) {
            e.stopPropagation();
        });
        at.on('alphaTab.loaded', function(e, score) {
            var trackList = $('#trackList');
            trackList.empty();
            
            for( var i = 0; i < score.Tracks.length; i++) {
                var li = $('<li></li>')
                    .data('track', score.Tracks[i].Index)
                ;
                
                var title = $('<div class="title"></div>');
                li.append(title);
                
                var showHide = $('<i class="glyphicon glyphicon-eye-close showHide"></i>');
                title.append(showHide);
                title.append(score.Tracks[i].Name);
                title.on('click', function(e) {
                    var track = $(this).closest('li').data('track');
                    tracks = [track];
                    $(this).find('.showHide').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
                    
                    at.alphaTab('tracks', tracks);   
                });
                
                var soloMute = $('<div class="btn-group btn-group-xs"></div>');
                var solo = $('<button type="button" class="btn btn-default solo">Solo</button>');
                solo.on('click', function(e) {
                    $(this).toggleClass('checked');
                    var isSolo = $(this).hasClass('checked');
                    var track = $(this).closest('li').data('track');
                    at.alphaTab('soloTrack', track, isSolo);                    
                });
                
                var mute = $('<button type="button" class="btn btn-default mute">Mute</button>');
                mute.on('click', function(e) {
                    $(this).toggleClass('checked');
                    var isMute = $(this).hasClass('checked');
                    var track = $(this).closest('li').data('track');
                    at.alphaTab('muteTrack', track, isMute);                    
                });                
                soloMute.append(solo).append(mute);
                li.append(soloMute);
                
                var volume = $('<input type="text" />')
                    .on('slide', function(e) {
                        var track = $(this).closest('li').data('track');
                        at.alphaTab('trackVolume', track, e.value);
                    });
                li.append(volume);
                volume.slider({
                    min: 0,
                    max: 16,
                    step: 1,
                    value: score.Tracks[i].PlaybackInfo.Volume,
                    handle: 'square'
                })
                
                trackList.append(li);
            }
        });
        at.on('alphaTab.rendered', function(e) {
            tracks = at.alphaTab('tracks');
            for(var i = 0; i < tracks.length; i++) {
                tracks[i] = tracks[i].Index;
            }
            
            $('#trackList li').each(function() {
                var track = $(this).data('track');
                var isSelected = tracks.indexOf(track) > -1;
                if(isSelected) {
                    $(this).find('.showHide').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
                }
                else {
                    $(this).find('.showHide').removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
                }
            });       
        });    