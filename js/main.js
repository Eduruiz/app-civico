(function(window, document) {
    'use strict';

    fetchDistricts();

    const $districts = document.querySelector('[data-id="districts"]');

    $districts.addEventListener('change', () => {
        const id = this.options[this.selectedIndex].dataset.id;
        clearResults();
        fetchGoals(id);
    })

    function fetchGoals(id) {
        const $results = document.querySelector('[data-js="results"]');

        fetch('http://2013.deolhonasmetas.org.br/api/public/goals?region_id=' + id)
        .then(response =>
            response.json()
        )
        .then(goalsJSON => {
            const goals = goalsJSON.goals;

            goals.forEach((item, index) => {
                // I don't get exactly why the api is sending more than 100
                // as % answer, so I assumed it's a bug and adjusted it here.
                item.percentage.owned > 100 ? item.percentage.owned = 100 : '';
                // Transforming the expected_budget in a more readable currency
                item.expected_budget = Number(item.expected_budget).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const $result = `
                    <article>
                        <h2>META: ${item.name}</h2>
                        <h3>${item.description}</h3>
                        <span>Orçamento Esperado: ${item.expected_budget}</span>

                        <div class="dates">
                            ${item.expected_start_date !== null ?
                                    `<small>Data de inicio: ${item.expected_start_date}</small>`
                                    : ''
                            }
                            ${item.expected_start_date !== null ?
                                    `<small>Data Final: ${item.expected_end_date}</small>`
                                    : ''
                            }
                        </div>

                        <h4>
                            O que sera entregue?
                            <br>
                            ${item.will_be_delivered}
                        </h4>
                        <h4>Progresso:</h4>
                        <progress
                            max="100"
                            value="${item.percentage.owned}"
                            data-label="${item.percentage.owned}%">
                        </progress>
                        <h4>Etapas</h4>
                        <ul>
                            ${item.qualitative_progress_1 !== '' ?
                                    `<li><p>${item.qualitative_progress_1}</p></li>`
                                    : ''
                            }
                            ${item.qualitative_progress_2 !== '' ?
                                    `<li><p>${item.qualitative_progress_2}</p></li>`
                                    : ''
                            }
                            ${item.qualitative_progress_3 !== '' ?
                                    `<li><p>${item.qualitative_progress_3}</p></li>`
                                    : ''
                            }
                            ${item.qualitative_progress_4 !== '' ?
                                    `<li><p>${item.qualitative_progress_4}</p></li>`
                                    : ''
                            }
                            ${item.qualitative_progress_5 !== '' ?
                                    `<li><p>${item.qualitative_progress_5}</p></li>`
                                    : ''
                            }
                            ${item.qualitative_progress_6 !== '' ?
                                    `<li><p>${item.qualitative_progress_6}</p></li>`
                                    : ''
                            }
                        </ul>
                    </article>
                `
                $results.insertAdjacentHTML('beforeend', $result)
            })
        })
    }

    function fetchDistricts() {
        fetch('http://2013.deolhonasmetas.org.br/api/public/districts')
        .then(response =>
            response.json()
        )
        .then(districtsJSON => {
            const districts = districtsJSON.districts;
            const $option = document.createElement('option');
            const $districts = document.querySelector('[data-id="districts"]');

            districts.forEach((item, index) => {
                const $option = `<option data-id="${item.id}">${item.name}</option>`
                $districts.insertAdjacentHTML('beforeend', $option);
            })
        })
        .then(() => {
            document.querySelector('[data-js="loading"]').textContent = 'Escolha o Distrito';
        });
    }

    function clearResults() {
        document.querySelector('[data-js="results"]').innerHTML = '';
    }
}(window, document));
