// Function to update time and date every 30 seconds
function updateTimeAndDate() {
    const timeElement = document.getElementById('incometime');
    const dateElement = document.getElementById('incomedate');

    if (timeElement) {
        timeElement.value = getCurrentTime();
    }
    if (dateElement) {
        dateElement.value = getCurrentDate();
    }
}

// Start timer to update time and date every 30 seconds
setInterval(updateTimeAndDate, 30000);

// Function to format the date in the required format for datetime-local
function getCurrentDate() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = String(nowDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(nowDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to format the time in the required format for datetime-local
function getCurrentTime() {
    const nowTime = new Date();
    const hours = String(nowTime.getHours()).padStart(2, '0');
    const minutes = String(nowTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set the value of the datetime-local input fields
    document.getElementById('incomedate').value = getCurrentDate();
    document.getElementById('incometime').value = getCurrentTime();

    // Initialize the time cell immediately
    updateTimeAndDate();

    // select2 functionality
    $(document).ready(function () {
        $('.goods').select2({
            placeholder: "ابحث أو اختر", // Placeholder text
            allowClear: true, // Allow clearing the selection
            width: '100%', // Make the dropdown responsive
            tags: true, // Enable tags (adding new options)
            tokenSeparators: [',', ' '] // Separate new tags with commas or spaces
        });

        $('.vendor').select2({
            placeholder: "ابحث أو اختر", // Placeholder text
            allowClear: true, // Allow clearing the selection
            width: '100%', // Make the dropdown responsive
            tags: true, // Enable tags (adding new options)
            tokenSeparators: [',', ' '] // Separate new tags with commas or spaces
        });
    });

    // Check database connection when page loads
    checkDatabaseConnection();

    // Add data to the database and table when clicking the Add button
    const addDataBtn = document.getElementById('addDatabtn');
    if (addDataBtn) {
        addDataBtn.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button behavior
            addData(); // Call function to add data to the database and table
        });
    } else {
        console.error('Element with ID "addDatabtn" not found');
    }
});

// Function to check database connection
function checkDatabaseConnection() {
    fetch('http://ahmedvbasic.runasp.net/api/ProductTransaction', {
        mode: 'cors'
    })
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                console.log('Database connection successful');
                console.log('Retrieved data:', data);
                populateTable(data);
            });
        } else {
            throw new Error('Database connection failed');
        }
    })
    .catch(error => {
        console.error('Database connection error:', error);
    });
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#tableBody tbody');
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }

    // Clear existing rows
    tableBody.innerHTML = '';

    // Add each record to the table
    data.forEach((record, index) => {
        const newRow = document.createElement('tr');
        const profit = (record.soldPrice - record.price) * record.quantity;

        newRow.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${record.goods}</td>
            <td>${record.quantity}</td>
            <td>${record.price}</td>
            <td>${record.soldPrice}</td>
            <td>${record.vendor}</td>
            <td>${record.incomeDate} ${record.incomeTime}</td>
            <td></td>
            <td></td>
            <td></td>
            <td>${profit}</td>
            <td></td>
        `;

        tableBody.appendChild(newRow);
    });
}

// Function to add data to the database and table
async function addData() {
    // Get form values
    const productName = document.getElementById('goods').value;
    const quantity = document.getElementById('quantity').value;
    const purchasePrice = document.getElementById('price').value;
    const sellingPrice = document.getElementById('soldprice').value;
    const supplierName = document.getElementById('vendor').value;
    const entryDate = document.getElementById('incomedate').value;
    const exitDate = document.getElementById('incomedate').value;

    if (!productName || !quantity || !purchasePrice || !sellingPrice || !supplierName || !entryDate || !exitDate) {
        console.error('Please fill all required fields!');
        return;
    }

    // Calculate profit
    const profit = (sellingPrice - purchasePrice) * quantity;

    // Prepare the data object
    const data = {
        id: autoIncrementId(),
        productName: productName,
        quantity: parseInt(quantity), // Ensure quantity is a number
        purchasePrice: Number(purchasePrice), // Ensure purchasePrice is a number
        sellingPrice: Number(sellingPrice), // Ensure sellingPrice is a number
        supplierName: supplierName,
        entryDate: entryDate,
        exitDate: entryDate,
        profit: Number(profit) // Ensure profit is a number
    };

    console.log('Data being sent:', JSON.stringify(data, null, 2));

    try {
        // Send POST request to the server to add data to the database
        const response = await fetch('http://ahmedvbasic.runasp.net/api/ProductTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorResponse = await response.json(); // Parse the error response
            console.error('Server error details:', errorResponse);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Data added successfully:', result);

        // Add the new data to the table
        addTableRow(data);

        // Reset form
        document.getElementById('maininputform').reset();

        // Update date and time fields
        document.getElementById('incomedate').value = getCurrentDate();
        document.getElementById('incometime').value = getCurrentTime();

    } catch (error) {
        console.error('Error adding data:', error);
    }
}

// Function to add a new row to the table
function addTableRow(data) {
    const tableBody = document.querySelector('#tableBody tbody');
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }

    const newRow = document.createElement('tr');
    const rowCount = tableBody.getElementsByTagName('tr').length + 1;

    newRow.innerHTML = `
        <th scope="row">${rowCount}</th>
        <td>${data.productName}</td>
        <td>${data.quantity}</td>
        <td>${data.purchasePrice}</td>
        <td>${data.sellingPrice}</td>
        <td>${data.supplierName}</td>
        <td>${data.entryDate} ${data.exitDate}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>${data.profit}</td>
        <td></td>
    `;

    tableBody.appendChild(newRow);
}

// Print function for the Data
function printDiv() {
    const printContents = document.getElementById('dataTable').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
}
function autoIncrementId() {
    const tableBody = document.querySelector('#tableBody tbody');
    if (!tableBody) {
        console.error('Table body not found!');
        return;
    }
}