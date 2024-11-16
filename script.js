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

const tableOfContents = document.querySelector("#table-of-contents");
const upcomingProgrammes = document.querySelector("#upcoming-workshops");

const data = fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRS5II35K0GWYLE2PjprTyP8IOQekp0VSdnlufSfpdiSBiyR6g_HwbyHO1bK0xSkVdUvcJFCS4qYJze/pub?gid=0&single=true&output=csv")
  .then((response) => response.text())
  .then((text) => {
    const rows = text.split("\n");
    rows.forEach((row, index) => {
      if (index === 0) {
        return;
      }
      const columns = row.split(",");
      const programme = {
        date: columns[0],
        companyName: columns[1],
        addressLine1: columns[2],
        addressLine2: columns[3],
        addressLine3: columns[4],
        county: columns[5],
        postcode: columns[6],
        link: columns[7],
      };
      // Manually parse the date string (assuming DD/MM/YYYY format)
      const [day, month, year] = programme.date.split("/");
      const programmeDate = new Date(`${year}-${month}-${day}`);

      // Get yesterday's date
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      if (programmeDate > yesterday) {
        const programmeElement = document.createElement("div");
        programmeElement.classList.add("programme-card");
        const name = programme.companyName.toLowerCase().replace(/ /g, "-");
        const tableOfContentsElement = document.createElement("li");
        tableOfContentsElement.innerHTML = `<a href="#${name}">${programme.companyName} - ${programme.date}</a>`;
        tableOfContents.appendChild(tableOfContentsElement);

        programmeElement.innerHTML = `
          <h3 id="${name}">${programme.companyName}</h3>
          <div class="programme-card__content">
            <p>${programme.date}</p>
            <p>
              ${programme.addressLine1 ? programme.addressLine1 + '<br>' : ''}
              ${programme.addressLine2 ? programme.addressLine2 + '<br>' : ''}
              ${programme.addressLine3 ? programme.addressLine3 + '<br>' : ''}
              ${programme.county ? programme.county + '<br>' : ''}
              ${programme.postcode ? programme.postcode : ''}
            </p>
            <a class="buy-now-button" href="${programme.link}" target="_blank">Sign Up</a>
          </div>
        `;
        upcomingProgrammes.appendChild(programmeElement);
      }
    });
  });