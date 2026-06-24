/**
 * Calcula a diferença em dias entre a data atual e uma data futura
 * @param {Date|string} dataAgendada A data que está no banco de dados
 * @returns {number} A quantidade de dias de diferença
 */
export const calcularDiferencaDias = (dataAgendada) => {
    const dataFutura = new Date(dataAgendada);
    const dataAtual = new Date();
    
    // Calcula a diferença em milissegundos
    const diferencaTempo = dataFutura.getTime() - dataAtual.getTime();
    
    // Converte milissegundos para dias e arredonda para cima
    return Math.ceil(diferencaTempo / (1000 * 3600 * 24));
};

/**
 * Formata a data do MySQL para o formato Brasileiro (DD/MM/YYYY HH:MM)
 * Ideal caso você queira tratar a data no backend antes de mandar pro React
 */
export const formatarDataBR = (dataSql) => {
    const data = new Date(dataSql);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(data);
};