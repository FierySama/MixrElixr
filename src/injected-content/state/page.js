import { log } from '../utils/index.js';
import { waitForMixer } from '../utils/wait-for.js';
import { urlDependentPromise } from '../utils/url-changed.js';
import $ from './plugins/jquery-wrapper.js';

const embedChatMatch = /^https?:\/\/(?:www\.)?mixer\.com\/embed\/chat\/(\w+)/;
const channelMatch = /^https?:\/\/(?:www\.)mixer\.com\/([^(){}%\\/?#]+)(?:\(hub:.*)?$/i;

let pageCache;

window.addEventListener('elixr:url-changed', function () {
    pageCache = null;
});

export default function () {
    if (!pageCache) {
        // remove query parameters and hash from uri
        // remove /mobile suffix from uri
        let uri = window.location.uri.replace(/[?#].*$/, '').replace(/\/mobile\/?$/, '');

        // Page: embedded chat
        let isEmbedChat = embedChatMatch.exec(uri);
        if (isEmbedChat != null) {
            pageCache = Promise.resolve({
                type: 'embedded-chat',
                channel: isEmbedChat[1]
            });

        // page deduction needs to wait for mixer to load
        } else {
            pageCache = urlDependentPromise(async resolve => {
                await waitForMixer();

                // fullfilled due to url change
                if (pageCache.fullfilled) {
                    return;
                }

                let details = {
                    desktop: $('b-channel-page-wrapper').length !== 0,
                    mobile: $('b-channel-mobile-page-wrapper').length !== 0
                };

                // Page: home page
                if ($('b-homepage').length !== 0) {
                    return resolve({
                        type: 'homepage'
                    });
                }

                // Page: other/unknown
                if (!details.desktop && !details.mobile) {
                    return resolve({
                        type: 'other'
                    });
                }

                // Page: channel
                details.type = 'channel';

                // Attempt to get channel name from uri
                let channelInUri = channelMatch.exec(uri);
                if (channelInUri != null) {
                    details.identifier = channelInUri[1];
                    return resolve(details);
                }


                // Attempt to get channel name from dom
                let pollPageForChannel = urlDependentPromise(resolve => {
                    (function pollForChannelName() {
                        if (pollPageForChannel.fullfilled) {
                            return;
                        }

                        let channel = '';
                        if (details.isDesktop) {
                            channel = $('b-channel-profile')
                                .find('h2')
                                .first()
                                .text();

                        } else {
                            channel = $('b-mobile-details-bar')
                                .find('.name')
                                .text();
                        }
                        channel = (channel || '').trim();

                        if (channel === '') {
                            setTimeout(pollForChannelName, 10);

                        } else {
                            log('Found channel name on page');
                            resolve(channel);
                        }
                    }());
                });
                let identifier = await pollPageForChannel;

                // promise fullfilled due to url change
                if (!pageCache || pageCache.fullfilled) {
                    return;
                }
                if (identifier != null) {
                    details.identifier = identifier;
                }
                return resolve(details);
            });
        }
    }
    return pageCache;
}