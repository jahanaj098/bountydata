// GitHub raw content URLs – REPLACE with your actual repo, branch, and paths!
const githubRawBase = 'https://raw.githubusercontent.com/yourusername/yourrepo/main/data/';
const fileNames = ['hackerone.json', 'bugcrowd.json', 'intigriti.json', '...']; // Add your filenames
const fileUrls = fileNames.map(name => `${githubRawBase}${name}`);

let allPrograms = [];

Promise.all(
    fileUrls.map(url =>
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                return response.json();
            })
            .catch(e => {
                console.warn(`Failed to load ${url}:`, e);
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

    // Case-insensitive, partial matches only
    const matches = allPrograms.filter(program =>
        program.name.toLowerCase().includes(searchTerm)
    );

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p>No programs found.</p>';
        return;
    }

    matches.forEach(program => {
        const programDiv = document.createElement('div');
        programDiv.className = 'program';
        programDiv.innerHTML = `
            <h3>${program.name}</h3>
            <p><strong>Platform:</strong> ${program.handle || 'N/A'}</p>
            <p><strong>Bounty:</strong> ${program.offers_bounties ? 'Yes' : 'No'}</p>
            <p><strong>Avg. First Response:</strong> ${program.average_time_to_first_program_response || 'N/A'} days</p>
            <p><strong>Avg. Resolution:</strong> ${program.average_time_to_report_resolved || 'N/A'} days</p>
            <p><strong>Scope:</strong> ${program.targets?.in_scope?.length || 0} in-scope targets</p>
            <p><strong>Website:</strong> <a href="${program.website}" target="_blank">${program.website}</a></p>
        `;
        resultsDiv.appendChild(programDiv);
    });
}
