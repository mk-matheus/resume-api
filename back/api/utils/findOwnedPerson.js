/**
 * Helper compartilhado: busca uma Person pelo ID e verifica
 * se ela pertence ao usuário logado (ownership check).
 *
 * Retorna { person } em caso de sucesso,
 * ou { error, status } se não encontrada/sem permissão.
 */
const findOwnedPerson = async (models, personId, userId) => {
  const person = await models.Person.findByPk(personId);

  if (!person) {
    return { error: "Pessoa não encontrada.", status: 404 };
  }

  if (person.userId !== userId) {
    return { error: "Acesso negado.", status: 403 };
  }

  return { person };
};

export default findOwnedPerson;
