// Update this with your actual GitHub username, repo name, branch, and path to your JSON files.
const githubRawBase = 'https://raw.githubusercontent.com/jahanaj098/bountydata/main/';
const jsonFiles = [
    'bugcrowd_data.json',
    'hackerone_data.json',
    'intigriti_data.json',
    'yeswehack_data.json'
];

let allPrograms = [];

// Load all JSON files from GitHub
Promise.all(
    jsonFiles.map(file => 
        fetch(`${githubRawBase}${file}`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${file}`);
                return response.json();
            })
            .catch(e => {
                console.warn(`Failed to load ${file}:`, e);
                return [];
            })
    )
).then(dataArrays => {
    allPrograms = dataArrays.flat();
    document.getElementById('searchInput').addEventListener('input', searchPrograms);
});

function searchPrograms() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const matches = allPrograms.filter(program =>
        program.name && program.name.toLowerCase().includes(searchTerm)
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p>No matching programs found.</p>';
        return;
    }

    matches.forEach(program => {
        const programDiv = document.createElement('div');
        programDiv.className = 'program';

        // Display key details; customize fields as needed
        programDiv.innerHTML = `
            <h3>${program.name}</h3>
            <p><strong>Platform:</strong> ${program.handle || 'N/A'}</p>
            <p><strong>Bounty:</strong> ${program.offers_bounties ? 'Yes' : 'No'}</p>
            <p><strong>Avg. First Response:</strong> ${program.average_time_to_first_program_response || 'N/A'} days</p>
            <p><strong>Avg. Resolution:</strong> ${program.average_time_to_report_resolved || 'N/A'} days</p>
            <p><strong>Scope:</strong> ${program.targets?.in_scope?.length || 0} in-scope targets</p>
            ${program.website ? `<p><strong>Website:</strong> <a href="${program.website}" target="_blank">${program.website}</a></p>` : ''}
        `;
        resultsDiv.appendChild(programDiv);
    });
}
