const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let idCounter = 0;
let jsonDataArray = [];

function generateUniqueId() {
  return ++idCounter;
}

// Read existing data from data.json if it exists
try {
  const data = fs.readFileSync("data.json", "utf8");
  jsonDataArray = JSON.parse(data);
  // Set idCounter to the maximum existing id to avoid conflicts
  idCounter = Math.max(...jsonDataArray.map((item) => item.id), 0);
} catch (err) {
  // If the file doesn't exist or has invalid content, ignore the error
}

function getUserInput() {
  rl.question(
    "Enter action (add/update/read/delete/lowest/highest/exit): ",
    (action) => {
      switch (action.toLowerCase()) {
        case "exit":
          console.log("Final JSON Data Array:");
          console.log(jsonDataArray);
          fs.writeFileSync("data.json", JSON.stringify(jsonDataArray, null, 2));
          rl.close();
          break;
        case "add":
          addData();
          break;
        case "update":
          updateData();
          break;
        case "read":
          readData();
          break;
        case "delete":
          deleteData();
          break;
        case "lowest":
          findLowestPriceData();
          break;
        case "highest":
          findHighestPriceData();
          break;
        default:
          console.log(
            "Invalid action. Please enter add, update, read, delete, or exit.",
          );
          getUserInput();
          break;
      }
    },
  );
}

function addData() {
  rl.question("Enter name: ", (name) => {
    rl.question("Enter shop name: ", (shopName) => {
      rl.question("Enter product name: ", (productName) => {
        rl.question("Enter product price: ", (price) => {
          rl.question("Enter quantity: ", (quantity) => {
            const jsonData = {
              id: generateUniqueId(),
              name,
              shopName,
              productName,
              price: parseFloat(price),
              quantity: parseInt(quantity),
              active: true, // Set the default value for 'active'
            };

            jsonDataArray.push(jsonData);

            console.log(`Data added: ${JSON.stringify(jsonData)}`);
            getUserInput();
          });
        });
      });
    });
  });
}

function updateData() {
  rl.question("Enter id of the data to update: ", (updateId) => {
    const dataToUpdate = jsonDataArray.find(
      (item) => item.id === parseInt(updateId),
    );
    if (!dataToUpdate) {
      console.log("Data not found for the provided id.");
      getUserInput();
    } else {
      rl.question(
        "Enter new name (or press Enter to keep current): ",
        (newName) => {
          rl.question(
            "Enter new shop name (or press Enter to keep current): ",
            (newShopName) => {
              rl.question(
                "Enter new product name (or press Enter to keep current): ",
                (newProductName) => {
                  rl.question(
                    "Enter new product price (or press Enter to keep current): ",
                    (newPrice) => {
                      rl.question(
                        "Enter new quantity (or press Enter to keep current): ",
                        (newQuantity) => {
                          // Update the properties with new values if provided
                          if (newName !== "") dataToUpdate.name = newName;
                          if (newShopName !== "")
                            dataToUpdate.shopName = newShopName;
                          if (newProductName !== "")
                            dataToUpdate.productName = newProductName;
                          if (newPrice !== "")
                            dataToUpdate.price = parseFloat(newPrice);
                          if (newQuantity !== "")
                            dataToUpdate.quantity = parseInt(newQuantity);

                          // Ask if the user wants to update 'active' property
                          rl.question(
                            "Is it active? (yes/no): ",
                            (isActive) => {
                              dataToUpdate.active =
                                isActive.toLowerCase() === "yes";

                              console.log(
                                `Data updated: ${JSON.stringify(dataToUpdate)}`,
                              );
                              getUserInput();
                            },
                          );
                        },
                      );
                    },
                  );
                },
              );
            },
          );
        },
      );
    }
  });
}

function readData() {
  console.log("JSON Data Array:");
  console.log(jsonDataArray);
  getUserInput();
}

function deleteData() {
  rl.question("Enter id of the data to delete: ", (deleteId) => {
    const dataToDelete = jsonDataArray.find(
      (item) => item.id === parseInt(deleteId),
    );
    if (!dataToDelete) {
      console.log("Data not found for the provided id.");
    } else {
      // Soft delete by marking as inactive
      dataToDelete.active = false;
      console.log(`Data with id ${deleteId} marked as inactive.`);
    }
    getUserInput();
  });
}
function findLowestPriceData() {
  const activeData = jsonDataArray.filter((item) => item.active);
  if (activeData.length === 0) {
    console.log("No active data available.");
  } else {
    const lowestPriceData = activeData.reduce((min, current) =>
      current.price < min.price ? current : min,
    );
    console.log("Lowest Price Data:");
    console.log(lowestPriceData);
  }
  getUserInput();
}

function findHighestPriceData() {
  const activeData = jsonDataArray.filter((item) => item.active);
  if (activeData.length === 0) {
    console.log("No active data available.");
  } else {
    const highestPriceData = activeData.reduce((max, current) =>
      /*let highestPriceData;
if (activeData.length > 0) {
  highestPriceData = activeData[0]; // Assume the first item has the highest price initially
  for (let i = 1; i < activeData.length; i++) {
    const current = activeData[i];
    if (current.price > highestPriceData.price) {
      highestPriceData = current;
    }
  }*/
      current.price > max.price ? current : max,
    );
    console.log("Highest Price Data:");
    console.log(highestPriceData);
  }
  getUserInput();
}

// Start the process by calling the getUserInput function
getUserInput();
