const config = { databaseURL: "https://ktpm-156ad-default-rtdb.asia-southeast1.firebasedatabase.app/" };
firebase.initializeApp(config);
const dbRef = firebase.database().ref();

function page_Load() {
    getAll();
}

function lnkID_Click(Id) {
    GetDetails(Id);
}

function btnSearch_Click() {
    var keyword = document.getElementById("txtKeyword").value.trim();
    if (keyword.length > 0) {
        search(keyword);
    } else {
        getAll();
    }
}

function btnAdd_Click() {
    var newPlane = {
        Id: document.getElementById("txtId").value,
        Brand: document.getElementById("txtBrand").value,
        Name: document.getElementById("txtName").value,
        Price: document.getElementById("txtPrice").value,
        Size: document.getElementById("txtSize").value
    }
    Add(newPlane);

}

function btnUpdate_Click() {
    var newPlane = {
        Id: document.getElementById("txtId").value,
        Brand: document.getElementById("txtBrand").value,
        Name: document.getElementById("txtName").value,
        Price: document.getElementById("txtPrice").value,
        Size: document.getElementById("txtSize").value

    };
    Update(newPlane);

}

function GetDetails(Id) {
    dbRef.child("planes").once("value", (snapshot) => {
        snapshot.forEach((child) => {
            var plane = child.val();
            if (plane.Id == Id) {
                renderPlaneDetails(plane);
            }
        });
    });
}

function btnDelete_Click() {
    if (confirm("Are you sure?")) {
        var Id = document.getElementById("txtId").value
        deletee(Id);
    }

}

function getAll() {

    dbRef.child("planes").on("value", (snapshot) => {
        var planes = [];
        snapshot.forEach((child) => {

            var plane = child.val();
            planes.push(plane);
        });
        renderPlaneList(planes);
    });

}





function deletee(Id) {
    dbRef.child("planes").once("value", (snapshot) => {
        snapshot.forEach((child) => {
            var plane = child.val();

            if (plane.Id == Id) {
                var key = child.key;
                dbRef.child("planes").child(key).remove();
            }
        });
    });
}



function Update(newPlane) {
    dbRef.child("planes").once("value", (snapshot) => {
        snapshot.forEach((child) => {
            var plane = child.val();
            if (plane.Id == newPlane.Id) {
                var key = child.key;
                dbRef.child("planes").child(key).set(newPlane);
            }
        });
    });

}


function Add(newPlane) {
    // dbRef.child ("books"). push (newBook); // auto -generated key
    dbRef.child("planes/P" + newPlane.Id).set(newPlane); // custom key
}



function search(keyword) {
    dbRef.child("planes").once("value", (snapshot) => {
        var planes = [];
        snapshot.forEach((child) => {
            var plane = child.val();
            if (plane.Name.toLowerCase().includes(keyword.toLowerCase())) {
                planes.push(plane);
            }
        });
        renderPlaneList(planes);
    });
}




function renderPlaneList(planes) {
    var rows = "";
    for (var plane of planes) {
        rows += "<tr onclick='lnkID_Click(" + plane.Id + ")' style='cursor:pointer'>";
        rows += "<td>" + plane.Id + "</td>";
        rows += "<td>" + plane.Brand + "</td>";
        rows += "<td>" + plane.Name + "</td>";
        rows += "<td>" + plane.Price + "</td>";
        rows += "<td>" + plane.Size + "</td>";
        rows += "</tr>";
    }
    var header = "<tr><th>Id</th><th>Brand</th><th>Name</th><th>Price</th><th>Size</th></tr>";
    document.getElementById("dataTable").innerHTML = header + rows;
}


function renderPlaneDetails(plane) {
    document.getElementById("txtId").value = plane.Id;
    document.getElementById("txtBrand").value = plane.Brand;
    document.getElementById("txtName").value = plane.Name;
    document.getElementById("txtPrice").value = plane.Price;
    document.getElementById("txtSize").value = plane.Size;

}

function clearTextboxes() {
    document.getElementById("txtId").value = '';
    document.getElementById("txtBrand").value = '';
    document.getElementById("txtName").value = '';
    document.getElementById("txtPrice").value = '';
    document.getElementById("txtSize").value = '';
}