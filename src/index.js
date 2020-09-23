// const btn = document.querySelector(".btn");
const inpFile = document.querySelector(".real-file");
const myForm = document.querySelector(".myForm");
const btnPrevious = document.querySelector(".previous");
const btnNext = document.querySelector(".next");
const inputeCrruentPage = document.querySelector(".current_page");
const zoomIn = document.querySelector(".zoom_in");
const zoomOut = document.querySelector(".zoom_out");
const guide = document.querySelector(".guide");

// btn.addEventListener("click", () => {
//   const text = document.querySelector("#txt").value;
//   responsiveVoice.speak(text);
// });

const myState = {
  pdf: null,
  currentPage: 1,
  zoom: 1.2,
  fullPages: null,
};

//render pdf from inpute

const pdfJsLib = pdfjsLib.getDocument("example2.pdf");
pdfJsLib.promise.then((pdf) => {
  const viewer = document.querySelector(".canvas_conteiner");
  myState.pdf = pdf;
  myState.fullPages = myState.pdf.numPages;
  if (myState.fullPages >= 1) {
    canvas = document.createElement("canvas");
    canvas.className = "pdf_renderer";
    viewer.appendChild(canvas);
    render(myState.currentPage, canvas);
  }
});

// render whole pdf on one screen

function render(pageNumber, canvas, scale = 1.2) {
  const PRINT_UNITS = 100 / 72;
  const ctx = canvas.getContext("2d");

  const renderTask = null;

  if (renderTask !== null) {
    console.log("es");
    renderTask.cancel();
    return;
  }

  myState.pdf
    .getPage(pageNumber)
    .then((page) => {
      const viewport = page.getViewport({ scale: scale });

      canvas.width = 1019;
      canvas.height = 1319;
      //after pdf pops up on the screen make everything form the top invisibility for now i suggest only when scroll up then shows input and upload button

      renderTask = page.render({
        canvasContext: ctx,
        transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
        viewport: viewport,
      }).promise;
    })
    .catch((err) => {
      if (err.name === "RenderingCancelledException") {
        render(myState.currentPage, canvas);
      }
    });
  //only for now
}

btnNext.addEventListener("click", () => {
  if (
    myState.pdf == null ||
    myState.currentPage > myState.pdf._pdfInfo.numPages
  )
    return;
  myState.currentPage = myState.currentPage + 1;
  inputeCrruentPage.value = myState.currentPage;

  render(myState.currentPage, canvas);
});

btnPrevious.addEventListener("click", () => {
  if (myState.pdf == null || myState.currentPage == 1) return;
  myState.currentPage = myState.currentPage - 1;
  inputeCrruentPage.value = myState.currentPage;

  render(myState.currentPage, canvas);
});

zoomIn.addEventListener("click", () => {
  myState.zoom = myState.zoom + 0.2;
  render(myState.currentPage, canvas, myState.zoom);
});

zoomOut.addEventListener("click", () => {
  if (myState.zoom != 1.2) {
    myState.zoom = myState.zoom - 0.2;
  }
  render(myState.currentPage, canvas, myState.zoom);
});

//onchange or onclick change page based of the inpute value
// inputeCrruentPage.addEventListener("change", (e) => {
//   myState.currentPage = inputeCrruentPage.value;
//   console.log(myState.currentPage);
//   render(myState.currentPage, canvas);
// });

// async function createParagraf() {
//   const loadingParagraf = document.createElement("p");
//   loadingParagraf.innerHTML = "Hello, wait a bit, the text is loading :)";
//   loadingParagraf.classList = "loadingparagraf";
//   const wrap = document.querySelector(".canvas_conteiner");
//   await wrap.appendChild(loadingParagraf);
// }

//implement this text to voice caller
async function getPdfText() {
  let check = false;
  const simleArray = [];
  let doc = await pdfjsLib.getDocument("example2.pdf").promise;
  let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
    return (await (await doc.getPage(i + 1)).getTextContent()).items.map(
      (token) => token.str
    );
  });
  // return it as an array
  const text = (await Promise.all(pageTexts)).join("");
  simleArray.push(text);

  const stopButton = document.querySelector(".stop");

  stopButton.addEventListener("click", () => {
    check = true;
    responsiveVoice.pause();
  });

  const speakButton = document.querySelector(".speak");
  speakButton.addEventListener("click", () => {
    simleArray.forEach(async (element) => {
      if (check) {
        responsiveVoice.resume();
      } else {
        responsiveVoice.speak(element);
      }

      // console.log("responsiveVoice", responsiveVoice.getWords());
    });
  });

  //search
  console.log("responsiveVoice", responsiveVoice);
}

getPdfText();

// quick guide

guide.addEventListener("click", () => {
  guide.classList = "guide smoothe";
  guide.innerHTML =
    "Hello thats quick guid, first choose File(only pdf) or use defult one, speak - use text speaker, stop - stop text speaker, next - next page, previous - previous page, + - zoom in, - - zoom out ";
  setTimeout(() => {
    guide.classList = "guide btn btn-secondary";
    guide.innerHTML = "Guide";
  }, 15000);
});
