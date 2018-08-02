# Hypothesis Counter

> Light-weight cross-browser add-on to preview the number of [Hypothesis](https://hypothes.is) annotations

- Quickly see if a page has been annotated
- Click on the button to annotate yourself

![](images/hypo-count.gif)

I created this light-weight extension as Hypothesis does not offer an official Firefox extension yet. Thus, my first priority was to get it running on Firefox. In theory, thanks to the WebExtension API, the Hypothesis Counter should soon be supporting Chrome, Opera, and even Edge <3.

## Installation

1. Download the latest .xpi file from the [releases page](https://github.com/Bubblbu/hypothesis-counter/releases)
2. Choose "Install Add-on from file" from the Firefox add-ons page (simply `Ctrl+Shift+A` or `Menu` -> `Add-ons`)
3. Install the previously downloaded .xpi file

## Development

Currently only available as an unpacked extension. To install:

1. `git clone git@github.com:Bubblbu/hypothesis-counter.git`
2. Open "about:debugging" in Firefox, click "Load Temporary Add-on" and select any file in the extension folder
3. The extension will now be installed, and will stay until you restart Firefox.

## Supported Browsers

- [x] Firefox (tested on 60.x)
- [ ] Chrome
- [ ] Edge

## Todo

- [ ] Finalize extension
- [ ] Cross-browser support
- [ ] Publish extension on [addons.mozilla.org](https://addons.mozilla.org) (and other browsers?)