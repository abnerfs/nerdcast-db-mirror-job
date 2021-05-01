export const log = (str: string) => {
    const text = ['['+new Date().toLocaleString('pt-br') +']'] + " " + str;
    console.log(text);
}