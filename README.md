# Dictionary Web App - Frontend Mentor Challenge


This is a solution to the [Dictionary Web App](https://www.frontendmentor.io/challenges/dictionary-web-app-h5wwnyuKFL). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

This challenge requires calling an api to retrieve dictionary word definitions and displaying them. The api chosen for this is [dictionaryapi.dev](https://dictionaryapi.dev).

This is a simple api call with a somewhat challenging response format. It is based on wikitext which is freeform, so there are often inconsistencies in the json that is returned, depending on word. For example, the audio file reference may be in second or third pronunciation slot in the returned array depending on what the article author did on wiktionary.

Themes throws in a new wrinkle with font themes of Sans-serif, Serif, Monospaced, along with the more typical day/night color scheme switching. Automatic system switching is also implemented.

An `<audio>` element is required in order to play mp3, ogg, etc. for the word pronunciation. The custom button requires that the audio element have controls hidden and be controlled through api only.

The web page must be fully accessible and support full keyboard navigation. This requires a custom dropdown menu implementation with appropriate aria usage to replace the intrinsic system accessibility normally available in `<select>`.

To add to the utility of the page, permalink hashes are added to the URL. This allows any search to be bookmarked and for back/forward browser navigation to act as a search history.

An accessible busy spinner and live region is used in this implementation. During development, the dictionaryapi.dev site went down for several hours. This forced better error handling, timeout handling etc.

### Screenshot

![Screenshot](./screenshot.webp)



## My process

Started Jan 22, 2023. Completed Feb 2, 2023.

### Built with

- dictionaryapi.dev
- Semantic HTML5 markup
- Mobile-first workflow
- Vercel hosting

### To Do

- ~~font dropdown keyboard navigation~~
- ~~search typography~~
- ~~focus color~~
- ~~vertical spacing (use 'illegal' as an example)~~
- ~~spacing between definition and example~~
- ~~adjust tablet desktop spacing as necessary~~
- ~~synonyms horizontal list and accent color~~
- ~~example text color 50% opacity, example on keyboard~~
- ~~padding at bottom of page~~
- ~~make synonym/antonym words clickable links~~
- ~~part of speech horizontal rule~~
- ~~when #keyword is in url, use it for search term. i.e. permalinks.~~
- ~~pseudo navigation via # in route. update with current keyword to allow bookmarking~~
- ~~busy spinner or indication~~
- ~~style error section~~
- ~~styling of select dropdown for font style change~~
- ~~render error text~~
- ~~handle 404 error state~~
- ~~hide play button when no selection~~
- ~~hover on moon~~
- ~~audio play button~~


