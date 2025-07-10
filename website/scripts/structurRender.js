class PageConstructor {
    constructor(data) {
        this.data = data.structure;
        this.init();
    }

    init() {
        CacheStorage.PagfeConstructor = this;
        this.buildHeader();
        this.buildBody('home'); // Tu peux changer selon la page à afficher
        this.buildFooter();
    }
    buildHeader() {
        const headerData = this.data.header;
        const header = document.createElement('header');
        if(headerData.logo){
            const logo = document.createElement('img');
            logo.src = headerData.logo;
            logo.alt = 'Logo';
            header.appendChild(logo);
        }
        const title = document.createElement('h1');
        title.textContent = headerData.title;
        header.appendChild(title);
/*
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        headerData.navLinks.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.name;
            li.appendChild(a);
            ul.appendChild(li);
        });
        nav.appendChild(ul);
        header.appendChild(nav);
        */

        document.body.appendChild(header);
    }
    buildBody(pageName) {
        const bodyData = this.data.bodys[pageName];
        for (let key in bodyData) {
            const elementData = bodyData[key];
            this.renderElement(key, elementData);
        }
    }
    renderElement(id, elementData) {
        const type = elementData.type;
        let element;

        switch (type) {
            case 'div':
                element = document.createElement('div');
                break;
            case 'cardExplanations':
                element = this.createCard(elementData.content);
                break;
            case 'list':
                element = this.createList(elementData.content, elementData.options);
                break;
            case 'iframe':
                element = document.createElement('iframe');
                element.src = elementData.content.src;
                break;
            case 'waiter':
                element = this.createWaiter(elementData.content, elementData.options);
                break;

            case 'mapActivity':
                element = this.createMapActivity(elementData.content, elementData.options);
                break;
            case 'popup':
                // Assurez-vous que le HTML pour le popup existe déjà dans votre page
                element = this.renderJournalPopup(elementData.content, elementData.options);
            default:
                console.warn(`Type inconnu : ${type}`);
                return;
        }
        element.id = id;

        if (elementData.parent) {
            const parent = document.getElementById(elementData.parent);
            if (parent) {
                parent.appendChild(element);
            } else {
                console.warn(`Parent ${elementData.parent} non trouvé pour ${id}`);
            }
        } else {
            document.body.appendChild(element);
        }
    }
    createCard(content) {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = content.picture;
        img.alt = content.title;
        card.appendChild(img);

        const title = document.createElement('h3');
        title.textContent = content.title;
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.innerHTML = content.description;
        card.appendChild(desc);

        return card;
    }
    createList(content, options = {}) {
        const container = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = content.title;
        container.appendChild(title);
        
        const ul = document.createElement('ul');
        if (options.scrollable) {
            container.style.maxHeight = options.maxHeight || '300px';
            let maxHeight = " calc("+options.maxHeight+" - 40px)"
            ul.style.maxHeight =  maxHeight || '270px';
            ul.style.overflowY = 'auto';
        }
        if (options.orderby) {
            switch (options.orderby) {
                case 'highest_altitude':
                    content.items.sort((a, b) => b.altitude_m - a.altitude_m);
                    break;
                case 'a-zCanton':
                    content.items.sort((a, b) => a.canton.localeCompare(b.canton));
                    break;  
                case 'z-aConton':
                    content.items.sort((a, b) => b.canton.localeCompare(a.canton));
                    break;
                 case 'lower_altitude':
                default:
                    content.items.sort((a, b) => a.altitude_m - b.altitude_m);
                    break;   
            }
        }
        content.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.canton}</strong> (${item.altitude_m}m) – ${item.point_culminant} `;
            ul.appendChild(li);
            if(item.done){
                li.classList.add('done');
            }
        });

        container.appendChild(ul);
        return container;
    }
    createWaiter(content, options = {}) {
        const container = document.createElement('div');
        container.classList.add('waiter-with-timeline');
        
        container.classList.add('expended');

        // === title ===
        const title = document.createElement('h2');
        title.textContent = content.title;
        container.appendChild(title);
        // === Timeline ===
        const timelineContainer = document.createElement('div');
        timelineContainer.classList.add('timeline-container');

        const timeline = document.createElement('div');
        timeline.classList.add('timeline');

        const startDate = document.createElement('span');
        startDate.classList.add('start-date');
        startDate.textContent = formatDateToFR(content.dayStart);

        const endDate = document.createElement('span');
        endDate.classList.add('end-date');
        endDate.textContent = formatDateToFR(content.dayEnd);

        const track = document.createElement('div');
        track.classList.add('track');

        const alpinist = document.createElement('div');
        alpinist.classList.add('alpinist');
        alpinist.id = 'alpinist';
        function formatDateToFR(dateStr) {
            const [year, month, day] = dateStr.split("-");
            return `${day} ${month} ${year}`;
        }
        track.appendChild(alpinist);
        timeline.appendChild(startDate);
        timeline.appendChild(track);
        timeline.appendChild(endDate);
        timelineContainer.appendChild(timeline);
        container.appendChild(timelineContainer);

        // === Countdown ===
        const countdownContainer = document.createElement('div');
        countdownContainer.classList.add('waiter');

        const countdownElement = document.createElement('div');
        countdownElement.classList.add('countdown');
        countdownContainer.appendChild(countdownElement);

        const units = ['days', 'hours', 'minutes', 'seconds'];
        const unitElements = {};

        units.forEach(unit => {
            const div = document.createElement('div');
            div.classList.add('time-unit', unit);
            countdownElement.appendChild(div);
            unitElements[unit] = div;
        });

        container.appendChild(countdownContainer);
        document.body.appendChild(container); // Ajoute tout au body

        // === Timing Logic ===
        const startDateTime = new Date(`${content.dayStart}T${content.timeStart}:00`);
        const endDateTime = new Date(`${content.dayEnd}T${content.timeEnd}:00`);
        const totalDuration = endDateTime - startDateTime;

        function update() {
            const now = new Date();
            const elapsed = now - startDateTime;
            const remaining = startDateTime - now;

            // Mise à jour de l'alpiniste
            if (now < startDateTime) {
                alpinist.style.left = '0%';
            } else if (now >= endDateTime) {
                timeline.classList.add('displayNone');
                title.innerHTML = `<span>Temps écoulé</span>`;
            } else {
                const progress = (elapsed / totalDuration) * 100;
                alpinist.style.left = `${progress}%`;
            }

            // Mise à jour du décompte
            if (remaining <= 0 && now < endDateTime) {
                const diff = endDateTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
               
                unitElements.days.textContent = `${days}j`;
                unitElements.hours.textContent = `${hours}h`;
                unitElements.minutes.textContent = `${minutes}min`;
                unitElements.seconds.textContent = `${seconds}s`;
            } else if (now >= endDateTime) {
                // Si la date de fin est atteinte, on compte le temps écoulé depuis le début
                const diff = now - startDateTime;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60); 
                 unitElements.days.textContent = `${days}j`;
                unitElements.hours.textContent = `${hours}h`;
                unitElements.minutes.textContent = `${minutes}min`;
                unitElements.seconds.textContent = `${seconds}s`;

            } else {
                const diff = startDateTime - now;
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                unitElements.days.textContent = `${days}j`;
                unitElements.hours.textContent = `${hours}h`;
                unitElements.minutes.textContent = `${minutes}min`;
                unitElements.seconds.textContent = `${seconds}s`;
            }
        }
        const interval = setInterval(update, 2000); // toutes les 2 secondes (alpiniste)
        update(); // mise à jour immédiate
        container.onclick = () => {
            container.classList.toggle('contracted');
            container.classList.toggle('expended');
        }
        if(window.innerWidth < 900) {
            container.click();
        }
        return container;
    }
    createMapActivity(content,options   = {}) {
        let iframe = document.createElement('iframe');
        iframe.classList.add( 'mapsActivity');
        iframe.src = liveTrackUrl;
        return iframe;
    }   
    buildFooter() {
        const footerData = this.data.footer;
        const footer = document.createElement('footer');
        for (let key in footerData) {
            switch (key) {
                case 'copyright':
                    const text = document.createElement('p');
                    text.classList.add('footer-copyright');
                    text.textContent = footerData[key];
                    footer.appendChild(text);
                    break;
                case 'links':
                    // Les liens sont gérés plus bas
                    let linksContainer = document.createElement('div');
                    linksContainer.classList.add('footer-links');
                     footerData.links.forEach(link => {
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.target = '_blank';
                        
                    
                        const img = document.createElement('img');
                        img.src = link.image;
                        img.alt = link.name;
                        img.style.width = '40px';
                        img.style.height = '40px';
                        img.style.borderRadius = '50%';

                        a.appendChild(img);
                        linksContainer.appendChild(a);
                    });
                    footer.appendChild(linksContainer);
                    break;
                case 'contact': 
                     /*"contact": {
                        "email": "sylvain.gandini@ikmail.com"
                    },*/
                    const contact = document.createElement('div');
                    contact.classList.add('footer-contact');
                    const email = document.createElement('a');
                    email.href = `mailto:${footerData.contact.email}`;
                    email.textContent = footerData.contact.email;
                    contact.appendChild(email);
                    footer.appendChild(contact);
                    break;
                default:
                    console.warn(`Type inconnu : ${key}`);
                    break;
            }
        }
        document.body.appendChild(footer);
    }
    renderJournalPopup(data, options = {}) {
        console.log("renderJournalPopup", data, options);
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.classList.add('popup');
        popup.innerHTML = `
        <span class="close" onclick="closePopup()">&times;</span>
            <div class="popup-content">
                <h2 id="popup-title"></h2>
                <p id="popup-description"></p>
                <p id="popup-date"></p>
            </div>
        `;
        document.body.appendChild(popup);
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastShown = localStorage.getItem('lastJournalPopup');
        
        /*if (lastShown === today) {
            console.log("Popup déjà affiché aujourd'hui", today != data.date);
            return; // Déjà affiché aujourd’hui
        }*/
        //const popup = document.getElementById('popup');
        if(data.title)document.getElementById('popup-title').textContent = data.title;
        if(data.description)document.getElementById('popup-description').textContent = data.description;
        if(data.date)document.getElementById('popup-date').textContent = `Date : ${data.date}`;
        localStorage.setItem('lastJournalPopup', today);
        

        function closePopup() {
            document.getElementById('popup').classList.add('displayNone');
        }
    }
}
