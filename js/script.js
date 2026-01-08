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

// Function to parse CSV row handling quoted fields
function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Function to load and display workshops
function loadWorkshops(options) {
  const {
    workshopsContainerId,
    mapContainerId = null,
    spreadsheetUrl,
    demographic = null,
    mapCenter = [53.0331978, -7.30267514],
    mapZoom = 7
  } = options;

  const workshopsContainer = document.querySelector(`#${workshopsContainerId}`);

  if (!workshopsContainer) {
    console.error(`Container with id "${workshopsContainerId}" not found`);
    return;
  }

  let map = null;

  // Initialize the map if a map container is specified
  if (mapContainerId) {
    const mapContainerElement = document.querySelector(`#${mapContainerId}`);
    if (mapContainerElement) {
      const mapElement = document.createElement("div");
      mapElement.id = `map-${workshopsContainerId}`;
      mapElement.style.height = "600px";
      mapContainerElement.appendChild(mapElement);

      map = L.map(mapElement).setView(mapCenter, mapZoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);
    }
  }

  fetch(spreadsheetUrl)
    .then((response) => response.text())
    .then((text) => {
      const rows = text.split("\n");
      rows.forEach((row, index) => {
        if (index === 0 || !row.trim()) {
          return; // Skip header row and empty rows
        }
        const columns = parseCSVRow(row);
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
          demographic: columns[10],
        };

        // Skip if essential data is missing
        if (!programme.date || !programme.companyName) {
          return;
        }

        // Filter by demographic if specified (trim to handle whitespace)
        if (demographic && programme.demographic.trim() !== demographic) {
          return;
        }

        // Manually parse the date string (assuming DD/MM/YYYY format)
        const [day, month, year] = programme.date.split("/");
        const programmeDate = new Date(`${year}-${month}-${day}`);

        // Get yesterday's date
        const currentDate = new Date();
        const yesterday = new Date(currentDate);
        yesterday.setDate(currentDate.getDate() - 1);

        if (programmeDate > yesterday) {
          const programmeElement = document.createElement("div");
          programmeElement.classList.add("card");
          const name = programme.companyName.toLowerCase().replace(/ /g, "-");

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
          workshopsContainer.appendChild(programmeElement);

          // Add marker to the map if latitude and longitude are valid
          if (map && programme.latitude && programme.longitude) {
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
    })
    .catch((error) => {
      console.error('Error loading workshops:', error);
    });
}

const spreadsheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRS5II35K0GWYLE2PjprTyP8IOQekp0VSdnlufSfpdiSBiyR6g_HwbyHO1bK0xSkVdUvcJFCS4qYJze/pub?gid=0&single=true&output=csv";

// Junior workshops
if (document.querySelector("#upcoming-workshops--juniors")) {
  loadWorkshops({
    workshopsContainerId: "upcoming-workshops--juniors",
    mapContainerId: "find-a-workshop--juniors",
    spreadsheetUrl: spreadsheetUrl,
    demographic: "Junior"
  });
}

// Adult workshops
if (document.querySelector("#upcoming-workshops--adults")) {
  loadWorkshops({
    workshopsContainerId: "upcoming-workshops--adults",
    mapContainerId: "find-a-workshop--adults",
    spreadsheetUrl: spreadsheetUrl,
    demographic: "Adult"
  });
}

// Off-canvas dialog menu.
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
