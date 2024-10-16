$(document).ready(function () {
    // Fetch and display all files when the page loads
    loadAllFiles();

    // Handle search form submission
    $("#searchForm").submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get form data
        const formData = {
            searchQuery: $("input[name='keywords']").val(),
            grade: $("input[name='grade']").val(),
            minRating: $("input[name='minimum']").val(),
        };

        // Call the Search API
        $.ajax({
            url: '/Search/GetFiles', // The endpoint for searching files
            type: 'GET',
            data: formData,
            success: function (data) {
                if (data.length === 0) {
                    // No files found
                    $("#noResultsMessage").show();
                    $("#fileListTable tbody").empty(); // Clear previous results
                } else {
                    // Files found
                    $("#noResultsMessage").hide();
                    $("#fileListTable tbody").empty(); // Clear previous results
                    data.forEach(file => {
                        $("#fileListTable tbody").append(`
                                    <tr>
                                        <td>${file.fileName}</td>
                                        <td>
                                            <button class="btn btn-primary" onclick="downloadFile('${file.fileName}')">Download</button>
                                            <button class="btn btn-danger" onclick="reportFile(${file.File_ID})">Report</button>
                                            <div class="star-rating">
                                                <input type="radio" id="star5-${file.fileName}" name="rating-${file.fileName}" value="5" onclick="rateFile(${file.File_ID}, 5)"><label for="star5-${file.fileName}">★</label>
                                                <input type="radio" id="star4-${file.fileName}" name="rating-${file.fileName}" value="4" onclick="rateFile(${file.File_ID}, 4)"><label for="star4-${file.fileName}">★</label>
                                                <input type="radio" id="star3-${file.fileName}" name="rating-${file.fileName}" value="3" onclick="rateFile(${file.File_ID}, 3)"><label for="star3-${file.fileName}">★</label>
                                                <input type="radio" id="star2-${file.fileName}" name="rating-${file.fileName}" value="2" onclick="rateFile(${file.File_ID}, 2)"><label for="star2-${file.fileName}">★</label>
                                                <input type="radio" id="star1-${file.fileName}" name="rating-${file.fileName}" value="1" onclick="rateFile(${file.File_ID}, 1)"><label for="star1-${file.fileName}">★</label>
                                            </div>
                                        </td>
                                    </tr>
                                `);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching files:', error);
            }
        });
    });
});

// Function to load all files
function loadAllFiles() {
    $.ajax({
        url: 'Search/executeGetFiles', // The endpoint to get all files
        type: 'GET',
        success: function (data) {
            if (data.length === 0) {
                $("#noResultsMessage").show();
                $("#fileListTable tbody").empty(); // Clear previous results
            } else {
                $("#noResultsMessage").hide();
                $("#fileListTable tbody").empty(); // Clear previous results
                data.forEach(file => {
                    const fileId = file.File_ID;
                    $("#fileListTable tbody").append(`
                                <tr>
                                    <td>${file.fileName}</td>
                                    <td>
                                        <button class="btn btn-primary" onclick="downloadFile('${file.fileName}')">Download</button>
                                        <button class="btn btn-danger" onclick="reportFile(${file.File_ID})">Report</button>
                                        <div class="star-rating">
                                            <input type="radio" id="star5-${file.fileName}" name="rating-${file.fileName}" value="5" onclick="rateFile(${file.File_ID}, 5)"><label for="star5-${file.fileName}">★</label>
                                            <input type="radio" id="star4-${file.fileName}" name="rating-${file.fileName}" value="4" onclick="rateFile(${file.File_ID}, 4)"><label for="star4-${file.fileName}">★</label>
                                            <input type="radio" id="star3-${file.fileName}" name="rating-${file.fileName}" value="3" onclick="rateFile(${file.File_ID}, 3)"><label for="star3-${file.fileName}">★</label>
                                            <input type="radio" id="star2-${file.fileName}" name="rating-${file.fileName}" value="2" onclick="rateFile(${file.File_ID}, 2)"><label for="star2-${file.fileName}">★</label>
                                            <input type="radio" id="star1-${file.fileName}" name="rating-${file.fileName}" value="1" onclick="rateFile(${file.File_ID}, 1)"><label for="star1-${file.fileName}">★</label>
                                        </div>
                                    </td>
                                </tr>
                            `);
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading files:', error);
        }
    });
}

// Report a file to the API
function reportFile(fileId) {
    if (fileId == null || fileId == undefined) {
        alert("File ID is invalid.");
        return;
    }
    $.ajax({
        url: `https://localhost:7255/Search/report?fileId=${fileId}`,
        type: 'POST',
        success: function () {
            alert("File reported successfully.");
        },
        error: function () {
            alert("Error reporting file.");
        }
    });
}

// Rate a file through the API
function rateFile(fileId, rating) {
    if (fileId == null || fileId == undefined) {
        alert("File ID is invalid.");
        return;
    }
    $.ajax({
        url: `/Search/rate?fileId=${fileId}&rating=${rating}`,
        type: 'POST',
        success: function () {
            alert("Rating submitted successfully.");
        },
        error: function (xhr, status, error) {
            console.error('Error submitting rating:', error);
            alert("Error submitting rating.");
        }
    });
}

// Download a file using AJAX
async function downloadFile(fileName) {
    try {
        const response = await axios.get('/Search/DownloadFile?fileName=${fileName}', {
            responseType: 'blob'
        });

        if (response.status === 200) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } else {
            displayStatusMessage("Error: ${response.data}", 'error');
        }
    } catch (error) {
        displayStatusMessage("Error downloading the file: ${error.response?.data ?? error.message", 'error');
    }
}
