console.log('Hello from The DIY Academy!');

const dialog = document.querySelector(".dialog");
const dialogCloseButton = document.querySelector(".dialog__close button");
const dialogContent = document.querySelector(".dialog__content");
const waitingListButtons = document.querySelectorAll(
  ".buy-now-button--waiting-list"
);

waitingListButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dialogContent.innerHTML = `
      <div id="fd-form-66e02649f4725e8e9c24793d"></div>
    `;
    let script = document.createElement('script');
    script.textContent = `
      window.fd('form', {
        formId: '66e02649f4725e8e9c24793d',
        containerEl: '#fd-form-66e02649f4725e8e9c24793d'
      });
    `;
    dialogContent.appendChild(script);
    dialog.showModal();
  });
});

dialogCloseButton.addEventListener("click", () => {
  dialog.close();
});