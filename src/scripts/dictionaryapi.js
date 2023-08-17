/*******************************************************************************
 * dictionaryapi.js
 *
 * Interface to vendor https://dictionaryapi.dev
 *
 * Query using HTTP GET https://api.dictionaryapi.dev/api/v2/entries/en/keyboard
 *
 *******************************************************************************/

async function dictionarySearch(term) {
  setBusy(true);

  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/" + term
    );
    if (response.status !== 200) {
      const result = await response.json();
      result.error = response.status;
      setBusy(false);
      return result;
    } else {
      setBusy(false);
      return await response.json();
    }
  } catch (err) {
    setBusy(false);
    console.log(err);
    return {
      error: 500,
      title: "severe error",
      message: "could not reach dictionary api",
    };
  }
}

function setBusy(isBusy) {
  const ariaBusy = Array.from(document.querySelectorAll("[aria-busy]"));
  ariaBusy.forEach((el) =>
    el.setAttribute("aria-busy", isBusy ? "true" : "false")
  );
}

export default dictionarySearch;
