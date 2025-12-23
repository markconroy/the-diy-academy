console.log('Hello from The DIY Academy!');

const dialog = document.querySelector(".dialog");
const dialogCloseButton = document.querySelector(".dialog__close button");
const dialogContent = document.querySelector(".dialog__content");
const waitingListButtons = document.querySelectorAll(
  ".buy-now-button--waiting-list"
);
const findAWorkshop = document.querySelector("#find-a-workshop");

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

// Initialize the map once
const mapElement = document.createElement("div");
mapElement.id = "main-map";
mapElement.style.height = "600px"; // Set height for the map
if (findAWorkshop) {
  findAWorkshop.appendChild(mapElement);
}

const map = L.map(mapElement).setView([53.0331978, -7.30267514], 7); // Default center and zoom
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRS5II35K0GWYLE2PjprTyP8IOQekp0VSdnlufSfpdiSBiyR6g_HwbyHO1bK0xSkVdUvcJFCS4qYJze/pub?gid=0&single=true&output=csv")
  .then((response) => response.text())
  .then((text) => {
    const rows = text.split("\n");
    rows.forEach((row, index) => {
      if (index === 0) {
        return; // Skip header row
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
        latitude: columns[8],
        longitude: columns[9],
      };

      // Manually parse the date string (assuming DD/MM/YYYY format)
      const [day, month, year] = programme.date.split("/");
      const programmeDate = new Date(`${year}-${month}-${day}`);

      // Get yesterday's date
      const currentDate = new Date();
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);

      if (tableOfContents && programmeDate > yesterday) {
        const programmeElement = document.createElement("div");
        programmeElement.classList.add("card");
        const name = programme.companyName.toLowerCase().replace(/ /g, "-");
        const tableOfContentsElement = document.createElement("li");
        tableOfContentsElement.innerHTML = `<a href="#${name}">${programme.companyName} - ${programme.date}</a>`;
        tableOfContents.appendChild(tableOfContentsElement);

        programmeElement.innerHTML = `
          <div class="card__content">
            <h3 id="${name}">${programme.companyName}</h3>
            <p>${programme.date}</p>
            <p>
              ${programme.addressLine1 ? programme.addressLine1 + '<br>' : ''}
              ${programme.addressLine2 ? programme.addressLine2 + '<br>' : ''}
              ${programme.addressLine3 ? programme.addressLine3 + '<br>' : ''}
              ${programme.county ? programme.county + '<br>' : ''}
              ${programme.postcode ? programme.postcode : ''}
            </p>
            <a class="button" href="${programme.link}" target="_blank">Sign Up</a>
          </div>
        `;
        upcomingProgrammes.appendChild(programmeElement);

        // Add marker to the map if latitude and longitude are valid
        if (programme.latitude && programme.longitude) {
          const lat = parseFloat(programme.latitude);
          const lng = parseFloat(programme.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`<strong>${programme.companyName}</strong><br>${programme.date} - <a href="${programme.link}" target="_blank">Sign Up</a>`);
          }
        }
      }
    });
  });

const dialogMenu = document.querySelector('.dialog-menu');
const dialogMenuClose = document.querySelector('.dialog-menu__close button');
const dialogMenuOpen = document.querySelector('.header__menu-button');

dialogMenuOpen.addEventListener('click', () => {
  dialogMenu.showModal();
  dialogMenuOpen.setAttribute('aria-expanded', 'true');
});

dialogMenuClose.addEventListener('click', () => {
  dialogMenu.close();
  dialogMenuOpen.setAttribute('aria-expanded', 'false');
});

const windowWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (window.innerWidth !== windowWidth) {
    if (dialogMenu.open) {
      dialogMenu.close();
      dialogMenuOpen.setAttribute('aria-expanded', 'false');
    }
  }
});
