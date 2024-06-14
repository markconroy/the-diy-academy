const dialog = document.querySelector(".dialog");
const dialogCloseButton = document.querySelector(".dialog__close button");
const dialogContent = document.querySelector(".dialog__content");
const waitingListButtons = document.querySelectorAll(
  ".buy-now-button--waiting-list"
);

waitingListButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dialogContent.innerHTML = `
      <div id="fd-form-666c9276b9cb123022ff0a6a"></div>
    `;
    let script = document.createElement('script');
    script.textContent = `
      window.fd('form', {
        formId: '666c9276b9cb123022ff0a6a',
        containerEl: '#fd-form-666c9276b9cb123022ff0a6a'
      });
    `;
    dialogContent.appendChild(script);
    dialog.showModal();
  });
});

dialogCloseButton.addEventListener("click", () => {
  dialog.close();
});
