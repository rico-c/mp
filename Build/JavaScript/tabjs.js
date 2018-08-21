at.on('alphaTab.soundFontLoad', function (e, progress) {
    var percentage = ((progress.loaded / progress.total) * 100) | 0;
    $('#soundFontProgress').css('width', percentage + '%').text(percentage + '%');
});
at.on('alphaTab.soundFontLoaded', function () {
    $('#soundFontProgressMenuItem').css('visibility', 'hidden');
    $('#playPausepic').attr('src', 'pics/play.svg')
});
at.on('alphaTab.playerReady', function () {
    $('#loadingInfo').hide();
    $('#playPause').prop('disabled', false).removeAttr('disabled');
    $('#stop').prop('disabled', false).removeAttr('disabled');
    $('#looping').prop('disabled', false).removeAttr('disabled');
    $('#metronome').prop('disabled', false).removeAttr('disabled');
    updateControls();
});
at.on('alphaTab.playerStateChanged', function () {
    updateControls();
});

at.alphaTab();

$('#print').click(function () {
    at.alphaTab('print');
});

$('#playPause').click(function () {
    at.alphaTab('playPause');
});

$('#stop').click(function () {
    at.alphaTab('stop');
});

$('#looping').click(function (e) {
    e.preventDefault();
    var looping = !at.alphaTab('loop');
    at.alphaTab('loop', looping);
    if (looping) {
        $('#looping').closest('li').addClass('active');
    }
    else {
        $('#looping').closest('li').removeClass('active');
    }
});

$('#metronome').click(function (e) {
    e.preventDefault();
    var metronomeVolume = at.alphaTab('metronomeVolume');
    if (metronomeVolume == 0) {
        at.alphaTab('metronomeVolume', 1);
        $('#metronome').closest('li').addClass('active');
    }
    else {
        at.alphaTab('metronomeVolume', 0);
        $('#metronome').closest('li').removeClass('active');
    }
});

$('#playbackSpeedSelector a').click(function () {
    var playbackSpeed = $(this).data('value');
    at.alphaTab('playbackSpeed', playbackSpeed);
    $('#playbackSpeed').text($(this).text());
});

function updateControls() {
    var playerState = at.alphaTab('playerState');
    switch (playerState) {
        case 0: // stopped/paused
            $('#playPause').removeClass('glyphicon-pause').addClass('glyphicon-play');
            break;
        case 1: // playing
            $('#playPause').removeClass('glyphicon-play').addClass('glyphicon-pause');
            break;
    }
}

$('a[data-layout]').click(function (e) {
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
$('#trackList').on('click', function (e) {
    e.stopPropagation();
});
at.on('alphaTab.loaded', function (e, score) {
    var trackList = $('#trackList');
    trackList.empty();

    for (var i = 0; i < score.Tracks.length; i++) {
        var li = $('<li></li>')
            .data('track', score.Tracks[i].Index)
        ;

        var title = $('<div class="title"></div>');
        li.append(title);

        var showHide = $('<i class="glyphicon glyphicon-eye-close showHide"></i>');
        title.append(showHide);
        title.append(score.Tracks[i].Name);
        title.on('click', function (e) {
            var track = $(this).closest('li').data('track');
            tracks = [track];
            $(this).find('.showHide').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');

            at.alphaTab('tracks', tracks);
        });

        var soloMute = $('<div class="btn-group btn-group-xs"></div>');
        var solo = $('<button type="button" class="btn btn-default solo">Solo</button>');
        solo.on('click', function (e) {
            $(this).toggleClass('checked');
            var isSolo = $(this).hasClass('checked');
            var track = $(this).closest('li').data('track');
            at.alphaTab('soloTrack', track, isSolo);
        });

        var mute = $('<button type="button" class="btn btn-default mute">Mute</button>');
        mute.on('click', function (e) {
            $(this).toggleClass('checked');
            var isMute = $(this).hasClass('checked');
            var track = $(this).closest('li').data('track');
            at.alphaTab('muteTrack', track, isMute);
        });
        soloMute.append(solo).append(mute);
        li.append(soloMute);

        var volume = $('<input type="text" />')
            .on('slide', function (e) {
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
at.on('alphaTab.rendered', function (e) {
    tracks = at.alphaTab('tracks');
    for (var i = 0; i < tracks.length; i++) {
        tracks[i] = tracks[i].Index;
    }

    $('#trackList li').each(function () {
        var track = $(this).data('track');
        var isSelected = tracks.indexOf(track) > -1;
        if (isSelected) {
            $(this).find('.showHide').removeClass('glyphicon-eye-close').addClass('glyphicon-eye-open');
        }
        else {
            $(this).find('.showHide').removeClass('glyphicon-eye-open').addClass('glyphicon-eye-close');
        }
    });
    $(".bottominfo").show();
});

/**
 * Plugin for displaying floating Bootstrap 3 `.alert`s.
 * @author odahcam
 * @version 1.0.0
 **/
;
(function ($, window, document, undefined) {

    "use strict";

    if (!$) {
        console.error("jQuery não encontrado, seu plugin jQuery não irá funcionar.");
        return false;
    }

    /**
     * Store the plugin name in a variable. It helps you if later decide to change the plugin's name
     * @type {string} pluginName
     **/
    var pluginName = 'bootoast';

    /*
     * The plugin constructor.
     */
    function BootstrapNotify(options) {

        if (options !== undefined) {

            // Variables default
            this.settings = $.extend({}, this.defaults);

            // Checa se foi passada uma mensagem flat ou se há opções.
            if (typeof options !== 'string') {
                $.extend(this.settings, options);
            } else {
                this.settings.message = options;
            }

            this.content = this.settings.content || this.settings.text || this.settings.message;

            // Define uma posição suportada para o .alert
            if (this.positionSupported[this.settings.position] === undefined) {
                // Tenta encontrar um sinônimo
                var positionCamel = $.camelCase(this.settings.position);

                if (this.positionSinonym[positionCamel] !== undefined) {
                    this.settings.position = this.positionSinonym[positionCamel] || 'bottom-center';
                }
            }

            var position = this.settings.position.split('-'),
                positionSelector = '.' + position.join('.'),
                positionClass = position.join(' ');

            // Define se o novo .alert deve ser inserido por primeiro ou último no container.
            this.putTo = position[0] == 'bottom' ? 'appendTo' : 'prependTo';

            // Define o .glyphicon com base no .alert-<type>
            this.settings.icon = this.settings.icon || this.icons[this.settings.type];

            var containerClass = pluginName + '-container';

            // Checa se já tem container, se não cria um.
            if ($('body > .' + containerClass + positionSelector).length === 0) {
                $('<div class="' + containerClass + ' ' + positionClass + '"></div>').appendTo('body');
            }

            // Adiciona o .alert ao .container conforme seu posicionamento.
            this.$el = $('<div class="alert alert-' + this.settings.type + ' ' + pluginName + '"><span class="glyphicon glyphicon-' + this.settings.icon + '"></span><span class="bootoast-alert-container"><span class="bootoast-alert-content">' + this.content + '</span></span></div>')[this.putTo]('.' + containerClass + positionSelector);

            if (this.settings.dismissable === true) {
                this.$el
                    .addClass('alert-dismissable')
                    .prepend('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>');
            }

            // Exibe o .alert
            this.$el.animate({
                opacity: 1,
            }, this.settings.animationDuration);

            // Se o .alert tem tempo de expiração
            if (this.settings.timeout !== false) {
                var secondsTimeout = parseInt(this.settings.timeout * 1000),
                    timer = this.hide(secondsTimeout),
                    plugin = this;

                // Pausa o timeout baseado no hover
                this.$el.hover(
                    clearTimeout.bind(window, timer),
                    function () {
                        timer = plugin.hide(secondsTimeout);
                    });
            }
        }
    };

    $.extend(BootstrapNotify.prototype, {
        /*
         * Default options
         * @type {Object} defaults
         */
        defaults: {
            message: 'Helo!', // String: HTML
            type: 'info', // String: ['warning', 'success', 'danger', 'info']
            position: 'bottom-center', // String: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
            icon: undefined, // String: name
            timeout: false,
            animationDuration: 300, // Int: animation duration in miliseconds
            dismissable: true
        },
        /*
         * Default icons
         * @type {Object} icons
         */
        icons: {
            warning: 'exclamation-sign',
            success: 'ok-sign',
            danger: 'remove-sign',
            info: 'info-sign'
        },
        /*
         * Position Sinonymus
         * @type {Object} positionSinonym
         */
        positionSinonym: {
            bottom: 'bottom-center',
            leftBottom: 'bottom-left',
            rightBottom: 'bottom-right',
            top: 'top-center',
            rightTop: 'top-right',
            leftTop: 'top-left'
        },
        /*
         * Position Supported
         * @type {array} positionSupported
         */
        positionSupported: [
            'top-left',
            'top-center',
            'top-right',
            'bottom-left',
            'bottom-right'
        ],
        /**
         * @type {method} hide
         * @param {int} timeout
         * @return {int} setTimeoutID The setTimeout ID.
         **/
        hide: function (timeout) {
            var plugin = this;
            return setTimeout(function () {
                plugin.$el.animate({
                    opacity: 0,
                }, plugin.settings.animationDuration, function () {
                    plugin.$el.remove();
                });
            }, timeout || 0);
        }
    });

    window[pluginName] = function (options) {
        return new BootstrapNotify(options);
    };

})(window.jQuery || false, window, document);
