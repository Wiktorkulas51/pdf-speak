// const btn = document.querySelector(".btn");
const inpFile = document.querySelector(".real-file");
const myForm = document.querySelector(".myForm");
const btnPrevious = document.querySelector(".previous");
const btnNext = document.querySelector(".next");
const inputeCrruentPage = document.querySelector(".current_page");
const zoomIn = document.querySelector(".zoom_in");
const zoomOut = document.querySelector(".zoom_out");

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
///something to add

const pdfJsLib = pdfjsLib.getDocument("example2.pdf");
pdfJsLib.promise.then((pdf) => {
  const viewer = document.querySelector(".canvas_conteiner");
  myState.pdf = pdf;
  myState.fullPages = myState.pdf.numPages;
  if (myState.fullPages >= 1) {
    canvas = document.createElement("canvas");
    canvas.className = "pdf_renderer";
    viewer.appendChild(canvas);
    for (let page = 1; page <= myState.fullPages; page++) {
      const wrapper = document.createElement("div");
      const createdCanvas = document.createElement("canvas");
      wrapper.appendChild(createdCanvas);

      render(page, canvas);
    }
  }
});

// render whole pdf on one screen

function render(pageNumber, canvas, scale = 1.2) {
  const PRINT_UNITS = 100 / 72;
  const ctx = canvas.getContext("2d");

  myState.pdf.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale: scale });

    canvas.width = 1019;
    canvas.height = 1319;
    //after pdf pops up on the screen make everything form the top invisibility for now i suggest only when scroll up then shows input and upload button

    if (page) {
      window.addEventListener("scroll", () => {
        // const scrollable =
        //   document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        console.log(Math.ceil(scrolled), "math");
        if (Math.ceil(scrolled) >= window.scrollY) {
          myForm.style.position = "sticky";
        }
        //there is problem with overwriting current value
        if ((myForm.classList.value = "myForm")) {
          myForm.classList.add("scrollDown");
          myForm.style.position = "static";
        }
      });
    }

    return page.render({
      canvasContext: ctx,
      transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
      viewport: viewport,
    }).promise;
  });
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

//implement this text to voice caller
async function getPdfText() {
  let doc = await pdfjsLib.getDocument("example2.pdf").promise;
  let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
    return (await (await doc.getPage(i + 1)).getTextContent()).items.map(
      (token) => token.str
    );
  });
  // return it as an array
  return (await Promise.all(pageTexts)).join("");
}

getPdfText();
