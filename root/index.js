// const btn = document.querySelector(".btn");
const inpFile = document.querySelector(".real-file");
const myForm = document.querySelector(".myForm");
const btnPrevious = document.querySelector(".previous");
const btnNext = document.querySelector(".next");
const inputeCrruentPage = document.querySelector(".current_page");
const zoomIn = document.querySelector(".zoom_in");
const zoomOut = document.querySelector(".zoom_out");
const guide = document.querySelector(".guide");
const label = document.querySelector(".inpute-label");

label.onclick = () => {
  inpFile.click();
  if (inpFile.value != inpFile.value) {
    return;
  } else {
    label.innerHTML = "File has been choose";
  }
};

const myState = {
  pdf: null,
  currentPage: 1,
  zoom: 1.2,
  fullPages: null,
  fileName: "./example2.pdf",
};

inpFile.onchange = (e) => {
  let file = e.target.files;
  console.log(file);
  const fileName = `./${file[0].name}`;
  if (fileName) {
    const fileDateName = (localStorage["myKey"] = fileName);
  }
};

const localDate = localStorage.getItem("myKey");

if (!localDate) {
  const pdfJsLib = pdfjsLib.getDocument(myState.fileName);
  pdfJsLib.promise.then((pdf) => {
    const viewer = document.querySelector(".canvas_conteiner");
    myState.pdf = pdf;
    myState.fullPages = myState.pdf.numPages;

    const maxPage = document.querySelector(".maxPage");
    maxPage.innerHTML = `/${myState.fullPages}`;

    if (myState.fullPages >= 1) {
      canvas = document.createElement("canvas");
      canvas.className = "pdf_renderer";
      viewer.appendChild(canvas);
      render(myState.currentPage, canvas);
    }
  });
} else {
  const pdfJsLib = pdfjsLib.getDocument(localDate);
  pdfJsLib.promise.then((pdf) => {
    const viewer = document.querySelector(".canvas_conteiner");
    myState.pdf = pdf;
    myState.fullPages = myState.pdf.numPages;

    const maxPage = document.querySelector(".maxPage");
    maxPage.innerHTML = `/${myState.fullPages}`;

    if (myState.fullPages >= 1) {
      canvas = document.createElement("canvas");
      canvas.className = "pdf_renderer";
      viewer.appendChild(canvas);
      render(myState.currentPage, canvas);
    }
  });
}

async function render(pageNumber, canvas, scale = 1.2) {
  const PRINT_UNITS = 100 / 72;
  const ctx = canvas.getContext("2d");

  myState.pdf
    .getPage(pageNumber)
    .then((page) => {
      const cw = (canvas.width = 1019);
      const ch = (canvas.height = 1319);

      const scalee = () => {
        const unscaledViewport = page.getViewport({ scale: scale });

        scalea = Math.min(
          ch / unscaledViewport.height,
          cw / unscaledViewport.width
        );

        if (unscaledViewport.height != "950.4") {
          return scalea;
        }
      };

      const view = page.getViewport({
        scale: scalee() ? scalee() : scale,
      });

      // const scaleea = cw / (view.width * PRINT_UNITS);

      page.render({
        canvasContext: ctx,
        transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
        viewport: view,
        renderInteractiveForms: true,
      }).promise;
    })
    .catch((err) => {
      if (err.name === "RenderingCancelledException") {
        render(myState.currentPage, canvas);
      }
    });
}

btnNext.addEventListener("click", () => {
  if (
    myState.pdf == null ||
    myState.currentPage > myState.pdf._pdfInfo.numPages
  )
    return;
  myState.currentPage = parseInt(inputeCrruentPage.value) + 1;
  inputeCrruentPage.value = myState.currentPage;

  render(myState.currentPage, canvas);
});

btnPrevious.addEventListener("click", () => {
  if (myState.pdf == null || myState.currentPage == 1) return;
  myState.currentPage = inputeCrruentPage.value - 1;
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

inputeCrruentPage.addEventListener("keypress", (e) => {
  myState.currentPage = inputeCrruentPage.value;
  const val = inputeCrruentPage.value;
  e.keyCode == 13 ? render(parseInt(val), canvas) : console.log("");

  if (val >= myState.fullPages) {
    alert(`The pdf has only ${myState.fullPages} pages`);
  }
});

async function getPdfText() {
  let check = false;
  const simleArray = [];
  if (!localDate) {
    let doc = await pdfjsLib.getDocument(myState.fileName).promise;
    let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
      return (await (await doc.getPage(i + 1)).getTextContent()).items.map(
        (token) => token.str
      );
    });

    const text = (await Promise.all(pageTexts)).join("");
    simleArray.push(text);
  } else {
    let doc = await pdfjsLib.getDocument(localDate).promise;
    let pageTexts = Array.from({ length: doc.numPages }, async (v, i) => {
      return (await (await doc.getPage(i + 1)).getTextContent()).items.map(
        (token) => token.str
      );
    });

    const text = (await Promise.all(pageTexts)).join("");
    simleArray.push(text);
  }

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
        console.log(new SpeechSynthesisUtterance());
        console.log(navigator);
      }
    });
  });
}

getPdfText();

guide.addEventListener("click", () => {
  guide.classList = "guide smoothe";
  guide.innerHTML =
    "Hello thats quick guid, first choose File(only pdf) or use defult one, speak - use text speaker, stop - stop text speaker, next - next page, previous - previous page, + - zoom in, - - zoom out ";
  setTimeout(() => {
    guide.classList = "guide btn btn-secondary";
    guide.innerHTML = "Guide";
  }, 15000);
});
