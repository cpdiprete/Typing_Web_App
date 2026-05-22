// "use client";
export function drop_database() {
  // const endpoint = "http://127.0.0.1:5000/dropdb";
    const endpoint = "http://localhost:5000/dropdb";
    fetch(endpoint).then(response => {
        if (!response.ok) {
        throw new Error(
            `Http error!!!`
        );
        }
        return response.json()
    })
}

export async function clear_database(refreshUI: () => void) {
    const endpoint = "http://localhost:5000/cleardb";
    const response = await fetch(endpoint)
    if (!response.ok) {
        throw new Error(`Http error!!!, `);
    }
    refreshUI();
    const data = await response.json()
    return data
}
export function init_database() {
    // const endpoint = "http://127.0.0.1:5000/init_db";
    const endpoint = "http://127.0.0.1:5000/init_db";
    fetch(endpoint).then(response=> {
        if (!response.ok) {
        throw new Error(
            'Http error in page.init_database'
        )
        }
        return response.json()
    })
}
export function retrieve_database_entries(updater) {
    // http://localhost:5000
    const endpoint = 'http://localhost:5000/get_entries_dict'
    let entries_dict = fetch(endpoint).then(response => {
        if (!response.ok) {
        throw new Error (
            'Http error in page.retrieve_database_entries!'
        )
    }
        // console.log(response)
        return response.json()
    }).then(data => {
        console.log("page.txt.retrieve_database_entries() response...")
        console.log(data.entries_dict)
        updater(data.entries_dict)
    })
    // console.log(entries_dict)
}
export function createLesson(title:string, text:string, popup_updater_function) {
    // const endpoint = `http://localhost:5000/add_lesson/${title}/${text}`
    const endpoint = `http://localhost:5000/add_lesson`
    fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: title, text: text})
    }).then(response => {
    if (!response.ok) {
        throw new Error(
            'Http error in page/createLesson'
        )
    }
        popup_updater_function(false)
        return response // need to return something so I xan make an "if ..then based on this funcgion to set the new lesson popup"
    })
}
export async function getTotalAccuracy(card_id: number) {
    const endpoint = `http://127.0.0.1:5000/get_accuracy`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ card_id: card_id })
    }
    )
    if (!response.ok) {
        console.log("Issue, response = ",  response)
        throw new Error(`Http error!!!, `);
    }
    const data = await response.json();
    console.log(data.accuracy)
    return data.accuracy;
}
export async function updateTotalStats(card_id:number, correct_chars: number, incorrect_chars: number, seconds:number) {
    const endpoint = `http://127.0.0.1:5000/update_total_stats`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify({card_id: card_id, correct: correct_chars, incorrect: incorrect_chars, seconds: seconds})
    })
    if (!response.ok) {
        throw new Error("Request failed");
    }
    console.log("Updated total accuracy")
}
export async function getProblemKeys() {
    const endpoint = "http://localhost:5000/get_key_accuracy_dict"
    let return_result = await fetch(endpoint, {method: "GET",})
    let data = await return_result.json()
    // return data
    // // const data = return_result.json()
    console.log("+++++++++++, ", data)
    return data
}
export async function getTopXProblemKeys(X: number) {
    const endpoint = `http://localhost:5000/getTopXProblemKeys`
    let resp = await fetch(endpoint, {method: "POST", 
        headers: {'Content-Type': 'application/json'
        },
        body: JSON.stringify({number_of_problem_keys: X})
    })
    let data = await resp.json()
    console.log(data.ProblemKeys)
    return data.ProblemKeys
}

export async function populate_lessons_from_archive(updater) {
    const endpoint = 'http://localhost:5000/populate_lessons_from_archive'
    let resp = await fetch(endpoint, {method: "GET", })
    let data = await resp.json()
    if (data.status !== "ok") {
        console.log("Failed to populate lessons from archive entries")
    }
    updater()
    return data

}
export async function get_account_total_wpm_and_accuracy() {
    const endpoint = 'http://localhost:5000/get_total_wpm_and_accuracy'
    let resp = await fetch(endpoint, {method: "GET", })
    let data = await resp.json()
    if (data.status !== "ok") {
        console.log("Failed to retrieve all-time wpm and accuracy stats")
    }
    return [Number(data.wpm), Number(data.accuracy), data.typing_time]
}
export async function get_wpm_and_accuracy_plot(id : number, wpmUpdater) {
    const endpoint = `http://127.0.0.1:5000/get_wpm_and_accuracy_plot`

    const response = fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cardId: id})
    }).then((resp) => {
        if (!resp.ok) {
            throw new Error(`HTTP error in wpmplots.get_wpm_and_accuracy_plot()`)
        }
        return resp.json()
    }
    ).then((data) => {
        let i = 0
        let wpmsDict = []
        while (i < data.wpms.length) {
            const newEntry = {index: i, wpm: data.wpms[i], accuracy: data.accuracies[i]}
            wpmsDict = [...wpmsDict, newEntry]
            i += 1
        }
        wpmUpdater(wpmsDict)
    })
}

export async function getTotalWpm(card_id: number) {
    const endpoint = `http://127.0.0.1:5000/get_wpm`;
    const response = await fetch(endpoint, 
        {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({card_id: card_id})
    }
    )
    if (!response.ok) {
        console.log("Issue, response = ",  response)
        throw new Error(`Http error!!!, `);
    }
    const data = await response.json();
    console.log(data)
    return data.wpm.toFixed(1)
}