// Function to generate reports based on type
function generateReport(type) {
    let reportTitle = '';
    let startDate = '';
    let endDate = '';
    
    // Set date range based on report type
    const today = new Date();
    switch(type) {
        case 'daily':
            reportTitle = 'التقرير اليومي';
            startDate = today;
            endDate = today;
            break;
        case 'weekly':
            reportTitle = 'التقرير الأسبوعي';
            startDate = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
            endDate = today;
            break;
        case 'monthly':
            reportTitle = 'التقرير الشهري';
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        case 'annual':
            reportTitle = 'التقرير السنوي';
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
            break;
        default:
            // Custom date range
            reportTitle = 'تقرير مخصص';
            startDate = document.getElementById('startDate').value;
            endDate = document.getElementById('endDate').value;
    }

    // Fetch data from the server
    fetch(`http://ahmedvbasic.runasp.net/api/ProductTransaction?type=${type}&startDate=${startDate}&endDate=${endDate}`)
        .then(response => response.json())
        .then(data => {
            displayReport(data, reportTitle);
        })
        .catch(error => {
            console.error('Error fetching report data:', error);
            alert('حدث خطأ أثناء جلب بيانات التقرير');
        });
}

// Function to display report data
function displayReport(data, title) {
    const reportTable = document.getElementById('reporttable');
    
    // Generate the report HTML
    reportTable.innerHTML = `
        <div class="report-header">
            <h2>${title}</h2>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>المنتج</th>
                        <th>السعر</th>
                        <th>الكمية</th>
                        <th>الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.productName}</td>
                            <td>${row.sellingPrice}</td>
                            <td>${row.quantity}</td>
                            <td>${row.sellingPrice * row.quantity}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="print-btn" onclick="printReport()">طباعة التقرير</button>
        </div>
    `;
    
}

// Function to handle printing

    function printReport() {
    // Hide the reports container before printing
    const reportsContainer = document.querySelector('.reports-container');
    reportsContainer.style.display = 'none';
    // Print the page
    window.print();

    // Reload the page to restore functionality (optional)
    location.reload();
}


// Function to validate JSON data
function validateJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize date selectors with available dates
function initializeDateSelectors() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    // Fetch available dates from server
    fetch('http://ahmedvbasic.runasp.net/api/ProductTransaction')
        .then(response => response.json())
        .then(dates => {
            dates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = formatDate(date);
                startDate.appendChild(option.cloneNode(true));
                endDate.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching dates:', error);
        });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeDateSelectors();
});
