//משתנה לשמירת מספר חודש
let nav =0;
// היה היום שנבחר
let clicked = null;
//מערך של תזכורות ששמורות בזיכרון הלוקלי של הדפדפן
// במידה והזיכרון רק זה מחזיר מערך ריק
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];


const  calendar = document.getElementById('calendar');
const deleteEventModal =document.getElementById('deleteEventModal');
const  newEventModal = document.getElementById('newEventModal');
const  backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


//פונקציה שרצה כול פעם שמריצים את הדף
function load(){
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav)
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month +1, 0).getDate();
    const  dateString = firstDayOfMonth.toLocaleDateString('en-GB', {
        weekday: 'long' ,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
    console.log(dateString)
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-GB',{ month:'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++){
        const daySquare = document.createElement("div");
        daySquare.classList.add("day")

        const dayString =  `${i - paddingDays}/${month+1}/${year}`;

        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.find(e => e.date === dayString);

            if (i - paddingDays === day && nav === 0){
                daySquare.id = 'currentDay';
            }

            if (eventForDay){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv)
            }

            daySquare.addEventListener('click', () => openModal(dayString))
        } else {
            daySquare.classList.add("padding");
        }
        calendar.appendChild(daySquare);
    }
}

function openModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay){
        document.getElementById('eventText').innerText=eventForDay.title;
        deleteEventModal.style.display = 'block';
    } else {
        newEventModal.style.display = 'block';
    }
    backDrop.style.display = 'block';

}

//דברים שחובה לבצע לפני שסוגרים את החלון קופץ של האירוע
function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    deleteEventModal.style.display = 'none';
    load();
}

function saveEvent() {
    if (eventTitleInput.value){
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title:eventTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal()

    }else{
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent(){
    events = events.filter(e => e.date !==clicked);
    localStorage.setItem('events', JSON.stringify(events))
    closeModal()
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    })
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    })

    document.getElementById('saveButton').addEventListener('click', () => {
        saveEvent()
    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        closeModal()
    });

    document.getElementById('closeButton').addEventListener('click', () => {
        closeModal()
    });

    document.getElementById('deleteEventModal').addEventListener('click', () => {
        deleteEvent()
    });

}
initButtons();
load();












