/**
 * Classe utilitária que implementa o padrão Result (Railway Oriented Programming),
 * encapsulando o retorno de operações que podem ter sucesso ou falha,
 * evitando o uso excessivo de exceções para controle de fluxo.
 *
 * @class Result
 *
 * @property {boolean} ok     - Indica se a operação foi bem-sucedida
 * @property {*} value        - Valor retornado em caso de sucesso (null em falha)
 * @property {Error} error    - Erro retornado em caso de falha (null em sucesso)
 * @property {number} status  - Código de status HTTP associado ao resultado
 *
 * @example
 * // Criando um resultado de sucesso
 * const sucesso = Result.of({ id: 1, nome: "João" })
 * console.log(sucesso.ok)    // true
 * console.log(sucesso.value) // { id: 1, nome: "João" }
 *
 * @example
 * // Criando um resultado de falha
 * const falha = Result.fail("Usuário não encontrado", 404)
 * console.log(falha.ok)     // false
 * console.log(falha.error)  // Error: "Usuário não encontrado"
 * console.log(falha.status) // 404
 */
class Result {

  /**
   * @constructor
   * @param {boolean} ok     - Indica se o resultado é de sucesso
   * @param {*} value        - Valor em caso de sucesso
   * @param {Error} error    - Erro em caso de falha
   * @param {number} status  - Código de status HTTP
   */
  constructor(ok, value, error, status) {
    this.ok = ok;
    this.value = value;
    this.error = error;
    this.status = status;
  }

  /**
   * Cria um Result de sucesso com o valor e status fornecidos.
   *
   * @static
   * @param {*} value            - Valor a ser encapsulado
   * @param {number} [status=200] - Código de status HTTP (padrão: 200)
   * @returns {Result} Instância de Result com ok = true
   *
   * @example
   * const result = Result.ok({ id: 1 }, 201)
   * console.log(result.status) // 201
   */
  static ok(value, status=200) {
    return new Result(true, value, null, status);
  }

  /**
   * Cria um Result de falha com o erro e status fornecidos.
   * Caso o erro não seja uma instância de `Error`, será convertido automaticamente.
   *
   * @static
   * @param {Error|string|*} error - Erro a ser encapsulado
   * @param {number} [status=400]  - Código de status HTTP (padrão: 400)
   * @returns {Result} Instância de Result com ok = false
   *
   * @example
   * // Passando uma instância de Error
   * const result = Result.fail(new Error("Não encontrado"), 404)
   *
   * @example
   * // Passando uma string (convertida automaticamente para Error)
   * const result = Result.fail("Não encontrado", 404)
   * console.log(result.error) // Error: "Não encontrado"
   */
  static fail(error, status = 400) {
    if(error.constructor.name === "Error") return new Result(false, null, error, status);
    return new Result(false, null, new Error(`${error}`), status);
  }

  /**
   * Atalho para criação de um Result de sucesso com status 200.
   * Equivalente a chamar `Result.ok(value)`.
   *
   * @static
   * @param {*} value - Valor a ser encapsulado
   * @returns {Result} Instância de Result com ok = true e status 200
   *
   * @example
   * const result = Result.of({ id: 1 })
   * console.log(result.ok)    // true
   * console.log(result.status) // 200
   */
  static of(value) {
    return Result.ok(value);
  }

  /**
   * Aplica uma função de transformação ao valor do Result,
   * caso seja um resultado de sucesso. Em caso de falha, retorna o próprio Result
   * sem aplicar a transformação.
   *
   * @param {function(*): *} fn - Função de transformação aplicada ao valor
   * @returns {Result} Novo Result com o valor transformado, ou o Result de falha original
   *
   * @example
   * const result = Result.of(5).map(x => x * 2)
   * console.log(result.value) // 10
   *
   * @example
   * // Em caso de falha, a função não é aplicada
   * const result = Result.fail("erro").map(x => x * 2)
   * console.log(result.ok) // false
   */
  map(fn) {
    if (!this.ok) return this;
    return Result.ok(fn(this.value));
  }

  /**
   * Aplica uma função que retorna um novo Result ao valor atual,
   * caso seja um resultado de sucesso. Útil para encadear operações
   * que também retornam Result, evitando aninhamentos.
   * Em caso de falha, retorna o próprio Result sem aplicar a função.
   *
   * @param {function(*): Result} fn - Função que recebe o valor e retorna um novo Result
   * @returns {Result} Result retornado pela função, ou o Result de falha original
   *
   * @example
   * const result = Result.of(5)
   *     .flatMap(x => x > 3 ? Result.of("válido") : Result.fail("inválido"))
   * console.log(result.value) // "válido"
   *
   * @example
   * // Em caso de falha, a função não é aplicada
   * const result = Result.fail("erro")
   *     .flatMap(x => Result.of("nunca executado"))
   * console.log(result.ok) // false
   */
  flatMap(fn) {
    if (!this.ok) return this;
    return fn(this.value);
  }
}

module.exports = Result