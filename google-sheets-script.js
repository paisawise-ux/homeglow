// =============================================================================
// Google Sheets Order Tracker — Google Apps Script
// =============================================================================
// 
// HOW TO SET UP (5 minutes, completely free):
//
// 1. Go to https://sheets.google.com → Create a new spreadsheet
// 2. Name it "HomeGlow Orders"
// 3. In Row 1, add these headers:
//    A1: Order ID | B1: Date | C1: Customer Name | D1: Phone | E1: Email
//    F1: Address | G1: City | H1: State | I1: Pincode
//    J1: Products | K1: Quantities | L1: Selling Price | M1: Cost Price
//    N1: Profit | O1: Shipping | P1: Total Charged | Q1: Payment Method
//    R1: Payment ID | S1: Status
//
// 4. Go to Extensions → Apps Script
// 5. Delete everything in the editor and paste this ENTIRE script
// 6. Click "Deploy" → "New Deployment"
// 7. Choose type: "Web App"
//    - Execute as: Me
//    - Who has access: Anyone
// 8. Click "Deploy" → Copy the Web App URL
// 9. Paste that URL in your app.js CONFIG.googleSheetURL
//
// That's it! Every order will auto-appear in your spreadsheet.
// =============================================================================

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Calculate totals
        var sellingTotal = 0;
        var costTotal = 0;
        var products = [];
        var quantities = [];

        for (var i = 0; i < data.items.length; i++) {
            var item = data.items[i];
            products.push(item.name);
            quantities.push(item.qty);
            sellingTotal += item.price * item.qty;
            costTotal += (item.costPrice || 0) * item.qty;
        }

        var profit = sellingTotal - costTotal;

        // Append row to sheet
        sheet.appendRow([
            data.orderId,                                    // A: Order ID
            data.date,                                       // B: Date
            data.customer.name,                              // C: Customer Name
            data.customer.phone,                             // D: Phone
            data.customer.email || '',                       // E: Email
            data.customer.address,                           // F: Address
            data.customer.city,                              // G: City
            data.customer.state,                             // H: State
            data.customer.pincode,                           // I: Pincode
            products.join(', '),                             // J: Products
            quantities.join(', '),                           // K: Quantities
            sellingTotal,                                    // L: Selling Price
            costTotal,                                       // M: Cost Price
            profit,                                          // N: Profit
            data.shipping,                                   // O: Shipping
            data.total,                                      // P: Total Charged
            data.paymentMethod,                              // Q: Payment Method
            data.paymentId,                                  // R: Payment ID
            'New'                                            // S: Status
        ]);

        return ContentService
            .createTextOutput(JSON.stringify({ success: true, orderId: data.orderId }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Test function — run this to verify the script works
function testPost() {
    var testData = {
        postData: {
            contents: JSON.stringify({
                orderId: "HG-TEST123",
                date: new Date().toLocaleString(),
                customer: {
                    name: "Test User",
                    phone: "9876543210",
                    email: "test@example.com",
                    address: "123 Test Street",
                    city: "Mumbai",
                    state: "Maharashtra",
                    pincode: "400001"
                },
                items: [
                    { name: "Test Product", qty: 1, price: 499, costPrice: 250 }
                ],
                shipping: 0,
                total: 499,
                paymentMethod: "Online",
                paymentId: "test_pay_123"
            })
        }
    };

    var result = doPost(testData);
    Logger.log(result.getContent());
}
