/*
  Copyright 2015–2019 Rocketship <https://rocketshipapps.com/>

  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.

  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

  You should have received a copy of the GNU General Public License along with
  this program. If not, see https://www.gnu.org/licenses/.

  Authors (one per line):

    Brian Kennish <brian@rocketshipapps.com>
*/
function populate(style, selector) {
  const SHEET = style.sheet;
  if (SHEET) SHEET.insertRule(selector + ' { display: none !important }', 0);
  else setTimeout(function() { populate(style, selector); }, 0);
}

EXTENSION.sendRequest({shouldInitialize: true}, function(response) {
  const PARENT_HOST = response.parentHost;
  const IS_WHITELISTED = response.isWhitelisted;
  var wereAdsFound;

  if (PARENT_HOST) {
    var selector = SELECTORS[PARENT_HOST];

    if (response.wasGrantButtonPressed) {
      if (PARENT_HOST == 'www.facebook.com')
          selector +=
              ', #pagelet_ads_when_no_friend_list_suggestion, #pagelet_ego_pane a[ajaxify*="&eid="], #pagelet_ego_pane a[ajaxify*="&eid="] + div, .ego_section a[href^="http://l.facebook.com/l.php?u="][href*="%26adgroup_id%"], .ego_section a[href^="http://l.facebook.com/l.php?u="][href*="utm_medium"], .ego_section a[href^="http://l.facebook.com/l.php?u="][href*="utm_source"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="%26ad_id%"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="%26ad_id%"] + div, .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="%26adgroup_id%"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="%3Fcampaign%3D"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*=".intelliad.de"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="adfarm.mediaplex.com"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="fb_source%3Dad%26tag%3D"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="fb_source%3Dad%26tag%3D"] + div, .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="https%3A%2F%2Fgoo.gl%2F"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="utm_medium"], .ego_section a[href^="https://l.facebook.com/l.php?u="][href*="utm_source"], a[ajaxify*="&eid="] + a[href^="https://l.facebook.com/l.php?u="], a[href^="/ajax/emu/end.php?"], a[href^="https://l.facebook.com/"][href*="%2526ad_id%"]';
      else if (PARENT_HOST == 'twitter.com')
          selector +=
              ', .css-1dbjc4n.r-my5ep6.r-qklmqi.r-1adg3ll > .css-1dbjc4n.r-1loqt21.r-o7ynqc.r-1j63xyz > [class="css-1dbjc4n"], [class="css-1dbjc4n r-e84r5y r-1or9b2r"], .css-1dbjc4n.r-my5ep6.r-qklmqi.r-1adg3ll > [class="css-1dbjc4n"], .css-901oao.r-hkyrab.r-1qd0xha.r-a023e6.r-vw2c0b.r-ad9z0x.r-bcqeeo.r-vmopo1.r-qvutc0:first-child, .css-901oao.r-1re7ezh.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-vmopo1.r-qvutc0:nth-child(2), .css-901oao.r-1re7ezh.r-1qd0xha.r-n6v787.r-16dba41.r-1sf4r6n.r-1g94qm0.r-bcqeeo.r-qvutc0, [aria-label="Who to follow"] [data-testid="UserCell"]:first-child, .css-1dbjc4n.r-my5ep6.r-qklmqi.r-1adg3ll > .css-1dbjc4n.r-1wtj0ep.r-1sp51qo, [class="css-1dbjc4n r-1jgb5lz r-1ye8kvj r-13qz1uu"] [data-testid="UserCell"]';
    }

    if (selector) {
      if (!IS_WHITELISTED) {
        const STYLE = document.createElement('style');
        (document.head || document.documentElement).insertBefore(STYLE, null);
        populate(STYLE, selector);
      }

      onReady(function() {
        if (document.querySelectorAll(selector).length) wereAdsFound = true;
      });
    }

    onReady(function() {
      const IFRAMES = document.getElementsByTagName('iframe');
      const IFRAME_COUNT = IFRAMES.length;

      for (var i = 0; i < IFRAME_COUNT; i++) {
        var iframe = IFRAMES[i];
        var childHost = getHost(iframe.src);
        if (childHost != PARENT_HOST)
            for (var j = DOMAIN_COUNT - 1; j + 1; j--)
                if (DOMAINS[j].test(childHost)) {
                  if (!IS_WHITELISTED) {
                    var className = iframe.className;
                    iframe.className =
                        (className ? className + ' ' : '') +
                            'adblockfast-collapsed';
                  }

                  break;
                }
      }

      const IMAGES = document.getElementsByTagName('img');
      const IMAGE_COUNT = IMAGES.length;

      for (i = 0; i < IMAGE_COUNT; i++) {
        var image = IMAGES[i];
        var childHost = getHost(image.src);
        if (childHost != PARENT_HOST)
            for (var j = DOMAIN_COUNT - 1; j + 1; j--)
                if (DOMAINS[j].test(childHost)) {
                  if (!IS_WHITELISTED) {
                    var className = image.className;
                    image.className =
                        (className ? className + ' ' : '') +
                            'adblockfast-collapsed';
                  }

                  break;
                }
      }
    });
  }

  onReady(function() { EXTENSION.sendRequest({wereAdsFound: wereAdsFound}); });
});
