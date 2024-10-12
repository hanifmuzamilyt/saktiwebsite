window.toggleNavPane = function () {
    const sidebar = document.getElementById('sidebar');

    // Toggle the 'active' class to open/close the sidebar
    sidebar.classList.toggle('active');

    // Optional: If you want to add a class to the body to prevent scrolling when the sidebar is open
    if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
        document.body.style.overflow = ''; // Enable scrolling
    }
};