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

export function clear_database() {
    const endpoint = "http://localhost:5000/cleardb";
    fetch(endpoint).then(response => {
        if (!response.ok) {
        throw new Error(
            `Http error!!!`
        );
        }
        return response.json()
    })
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
    // const endpoint = 'http://127.0.0.1:5000/get_entries_dict'
    // http://127.0.0.1:5000
    let entries_dict = fetch(endpoint).then(response => {
        if (!response.ok) {
        throw new Error (
            'Http error in page.retrieve_database_entries!'
        )
    }
        // console.log(response)
        return response.json()
    }).then(data => {
        // console.log(data.entries_dict[0])
        // return data.entries_dict
        console.log("page.txt.retrieve_database_entries() response...")
        console.log(data.entries_dict)
        updater(data.entries_dict)
    })
    // console.log(entries_dict)
}
export function createLesson(title:string, text:string, popup_updater_function){
    console.log("------------------------")
    console.log("Title:", title)
    console.log("Text:", text)
    // const endpoint = `http://127.0.0.1:5000/add_lesson/${title}/${text}`
    const endpoint = `http://localhost:5000/add_lesson/${title}/${text}`
    // console.log(`page.tsx.createLesson endpoint: ${endpoint}`)
    fetch(endpoint, {
        method: "POST",
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