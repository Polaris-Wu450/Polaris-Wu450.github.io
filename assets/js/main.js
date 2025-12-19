// Update EST time
function updateESTTime() {
  const now = new Date();
  
  const estTimeString = now.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const estDateString = now.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  document.getElementById('estTime').textContent = estTimeString;
  document.getElementById('estDate').textContent = estDateString;
}

// Update time every second
updateESTTime();
setInterval(updateESTTime, 1000);

// Add click handler for clock section to link to Christmas tree project
document.getElementById('clockContainer').addEventListener('click', function() {
  // Link to built Christmas Tree project - explicitly point to index.html
  window.location.href = './christmas-tree/index.html';
});
