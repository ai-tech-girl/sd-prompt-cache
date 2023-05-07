const COOKIE_NAME = "_SD_PROMPT_CACHE";
let generateButton;

function setCookie(value, mins) {
  var expires = "";
  if (mins) {
    var date = new Date();
    date.setTime(date.getTime() + (mins * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = COOKIE_NAME + "=" + (JSON.stringify(value) || "") + expires + "; path=/";
}

function getCookie() {
  var nameEQ = COOKIE_NAME + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(c.substring(nameEQ.length, c.length));
      } catch (e) {
        console.error("Failed to parse json", e);
        return null;
      }
    }
  }
  return null;
}

function onClickGenerate() {
  const promptArea = get_uiCurrentTabContent().querySelector('div[id$=_prompt] textarea');
  const negativePromptArea = get_uiCurrentTabContent().querySelector('div[id$=_neg_prompt] textarea');
  if (!promptArea || !negativePromptArea) {
    return;
  }

  const prompt = promptArea.value;
  const negativePrompt = negativePromptArea.value;

  setCookie({
    prompt, negativePrompt
  }, 15);
}

function onChangeUiTab() {
  if (generateButton) {
    generateButton.removeEventListener('click', onClickGenerate);
  }

  generateButton = get_uiCurrentTabContent().querySelector('button[id$=_generate]');

  if (!generateButton) {
    return;
  }

  generateButton.addEventListener('click', onClickGenerate);

  const promptArea = get_uiCurrentTabContent().querySelector('div[id$=_prompt] textarea');
  const negativePromptArea = get_uiCurrentTabContent().querySelector('div[id$=_neg_prompt] textarea');
  if (!promptArea || !negativePromptArea) {
    return;
  }

  const prompt = promptArea.value;
  const negativePrompt = negativePromptArea.value;

  if (prompt.length > 0 || negativePrompt > 0) {
    return;
  }

  const cookie = getCookie();
  if (!cookie) {
    return;
  }

  promptArea.value = cookie["prompt"];
  negativePromptArea.value = cookie["negativePrompt"];
}

onUiTabChange(onChangeUiTab);