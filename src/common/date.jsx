let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; // 0 - 11
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // 0 - 6

export const getFormattedDate = (timestamp) => {
    let d = new Date(timestamp);
    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    let dateOfMonth = d.getDate();
    return `${day}, ${month} ${dateOfMonth}, ${year}`;
}
