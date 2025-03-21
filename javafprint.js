
        // Set current date
        const dateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);

        // Fetch customers from database
        async function loadCustomers() {
          try {
            const response = await fetch('http://ahmedvbasic.runasp.net/api/ProductTransaction');
            const customers = await response.json();
            const customerSelect = document.getElementById('customer');
            
            customers.forEach(customer => {
              const option = document.createElement('option');
              option.value = customer.id;
              option.textContent = customer.name;
              customerSelect.appendChild(option);
            });
          } catch (error) {
            console.error('Error loading customers:', error);
          }
        }

        // Load customers when page loads
        loadCustomers();
      //end of fetch customers


      //start of add item form

      document.getElementById('addItemForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
          product: document.getElementById('product').value,
          quantity: document.getElementById('quantity').value,
          price: document.getElementById('price').value,
          total: document.getElementById('total').value
        };

        try {
          const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });

          if (response.ok) {
            alert('تمت إضافة العنصر بنجاح');
            e.target.reset();
          } else {
            alert('حدث خطأ أثناء إضافة العنصر');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('حدث خطأ في الاتصال بالخادم');
        }
      });

      // Calculate total automatically
      const calculateTotal = () => {
        const quantity = document.getElementById('quantity').value;
        const price = document.getElementById('price').value;
        const total = quantity * price;
        document.getElementById('total').value = total.toFixed(2);
      };

      document.getElementById('quantity').addEventListener('input', calculateTotal);
      document.getElementById('price').addEventListener('input', calculateTotal);
      // Print receipt when print button is clicked
      document.querySelector('.bg-blue-500').addEventListener('click', () => {
        // Store the current page content
        const originalContent = document.body.innerHTML;
        
        // Create print-only content
        const printContent = document.querySelector('.bg-white.rounded-lg').cloneNode(true);
        
        // Remove the print button from print content
        const printButton = printContent.querySelector('.bg-blue-500').parentElement;
        printContent.removeChild(printButton);
        
        
        // Replace page content with print content
        document.body.innerHTML = `
          <div style="direction: rtl; padding: 20px;">
            <h1 style="text-align: center; margin-bottom: 20px;">فاتورة</h1>
            ${printContent.innerHTML}
          </div>
        `;
        
        // Print the page
        window.print();
        
        // Restore original content
        document.body.innerHTML = originalContent;
        
        // Reattach event listeners after restoring content
        document.getElementById('quantity').addEventListener('input', calculateTotal);
        document.getElementById('price').addEventListener('input', calculateTotal);
        document.getElementById('addItemForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const formData = {
            product: document.getElementById('product').value,
            quantity: document.getElementById('quantity').value,
            price: document.getElementById('price').value,
            total: document.getElementById('total').value
          };
        
          try {
            const response = await fetch('/api/items', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });

            if (response.ok) {
              alert('تمت إضافة العنصر بنجاح');
              e.target.reset();
            } else {
              alert('حدث خطأ أثناء إضافة العنصر');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('حدث خطأ في الاتصال بالخادم');
          }
        });
        document.querySelector('.bg-blue-500').addEventListener('click', this);
      });
    