const frasedia = async () => {
    try {
        const response = await fetch('https://quote-garden.herokuapp.com/api/v3/quotes/random');
        if (response.ok) {
            const result = await response.json();
            const frase = document.getElementById('frase');
            frase.textContent = '';
            frase.classList.add('frase');
            frase.insertAdjacentHTML('beforeend', `<strong>The quote of the day is:</strong> <br>${result.data[0].quoteText}<br> &nbsp; <strong>~${result.data[0].quoteAuthor}</strong>`)
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}; const removefrase = () => {
    const frase = document.getElementById('frase');
    frase.classList.remove('frase');
    frase.textContent = "";
};

const pesquisacep = async function(){
    const cep = document.getElementById('cep');
    const city = document.getElementById('city');
    const state = document.getElementById('state');
    const street = document.getElementById('street');
    const district = document.getElementById('district');
    const complement = document.getElementById('complement');
    const resultcep = document.getElementById('result-cep');

    if (cep.value.length !== 8) {
        cep.focus();
        return;
    }
    try {
        const response = await fetch(`https://api.postmon.com.br/v1/cep/${cep.value}`);
        if (response.ok) {
            const result = await response.json();
            const valorcep = cep.value;

            limparcep();
            resultcep.insertAdjacentText('beforeend', `CEP: ${valorcep}`);
            city.value = result.cidade;
            state.value = result.estado;
            street.value = result.logradouro;
            district.value = result.bairro;
            complement.value = result.complemento == undefined ? complement.value = '' : result.complemento;

            if (result.logradouro == '') {
                street.removeAttribute('disabled');
            } 
            if (result.bairro == '') {
                district.removeAttribute('disabled');
            } 
            if (result.complemento == undefined) {
                complement.removeAttribute('disabled');
            }

        } else if (response.status == 404) {
            throw new Error('CEP não encontrado');
        } else if (response.status == 503) {
            throw new Error('Servidor indisponível, tente novamente em alguns segundos');
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}; const limparcep = () => {
    const campos = document.querySelector('fieldset');
    const resultcep = document.getElementById('result-cep');
    cep.value = '';
    city.value = '';
    state.value = '';
    street.value = '';
    number.value = '';
    district.value = '';
    complement.value = '';
    resultcep.textContent = '';
    Array.from(campos.children).forEach(e => {
        if (e.children[1].id !== 'number') {
            e.children[1].setAttribute('disabled', '');
        }
    })

};

const bandas = async () => {
    const banda = document.getElementById('buscabanda');
    const info = document.getElementById('bands');

    if (banda.value.length == 0) {
        banda.focus();
        return;
    }

    try {
        const response = await fetch(`https://musicbrainz.org/ws/2/artist?fmt=json&query=${banda.value.trim()}`);

        if (response.ok) {
            const result = await response.json();
            clearbands();
            if (result.artists.length == 0) {
                throw new Error('Aritsta não Encontrado');
            }

            info.insertAdjacentHTML('beforeend',
                `<fieldset id="result-bands">
                    <div id="infobands">
                        <a>Nome:</a> 
                        <a>Local de Origem:</a> 
                        <a>Na ativa:</a> 
                    </div>
                    <div id="result-infobands">
                        <a>${result.artists[0].name}</a>
                        <a>${result.artists[0].area == undefined ? 'não encontrado' : result.artists[0].area.name}</a>
                        <a>${result.artists[0]["life-span"].ended == null ? "Sim" : "Não"}</a>
                    </div>
                </fieldset>
                <p align="center">Resultados Encontrados: ${result.count}</p>
                <p id="idresultado"> id do resultado: ${result.artists[0].id}</p>`);
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}; const clearbands = () => {
    document.getElementById('limpar').addEventListener('click', () => document.getElementById('buscabanda').value = '');
    const info = document.getElementById('bands');
    info.innerHTML = '';
    if (info.children[0] !== undefined) {
        Array.from(info.children).forEach(e => e.remove());
    }
};

const pokedex = async () => {
    let pokenumber = () => Math.floor(Math.random() * 151) + 1;
    const pokemon = document.getElementById('pokemon');

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokenumber()}`);
        if (response.ok) {
            const result = await response.json();

            limparpokedex();
            pokemon.insertAdjacentHTML('beforeend',
                `<br> <div id="namepoke">${(result.name).toUpperCase()}</div>
                <img id="imgpoke" src="${result.sprites.other["official-artwork"].front_default}" alt="imagem${result.name}">
                <button class="limpar" onclick="limparpokedex()">
                Remover Pokemon
                </button>`);
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error.message);
    }

}; const limparpokedex = () => {
    const pokemon = document.getElementById('pokemon');

    pokemon.textContent = "";
};

const iniciar = () => {
    const forms = document.querySelectorAll('form');

    forms[0].addEventListener('submit', (e) => {
        e.preventDefault();
        frasedia();
    });

    forms[1].addEventListener('submit', (e) => {
        e.preventDefault();
        pesquisacep();
    });

    forms[2].addEventListener('submit', (e) => {
        e.preventDefault();
        bandas();
    });

    forms[3].addEventListener('submit', (e) => {
        e.preventDefault();
        pokedex();
    });

    forms[4].addEventListener('submit', (e) => {
        e.preventDefault();
        tvshowssearch();
    });
};



document.addEventListener('DOMContentLoaded', iniciar);