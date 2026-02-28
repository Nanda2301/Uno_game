const CardService = require('../services/CardService');
const CardRepository = require('../repositories/CardRepository');

jest.mock('../repositories/CardRepository');

describe('Requisito 5: Teste de interação com banco de dados', () => {
    it('Deve verificar a inserção, recuperação, atualização e exclusão de uma carta', async () => {
        const cardData = { color: 'red', value: '7', gameId: 1 };
        const mockCard = { id: 1, ...cardData };

        // Teste de Inserção (Create)
        CardRepository.create.mockResolvedValue(mockCard);
        const created = await CardService.create(cardData);
        expect(created).toMatchObject(mockCard);

        // Teste de Recuperação (Find)
        CardRepository.findById.mockResolvedValue(mockCard);
        const found = await CardService.findById(1);
        expect(found).toMatchObject(mockCard);

        // Teste de Atualização (Update)
        const updatedData = { color: 'blue' };
        CardRepository.update.mockResolvedValue({ ...mockCard, ...updatedData });
        const updated = await CardService.update(1, updatedData);
        expect(updated.color).toBe('blue');

        // Teste de Exclusão (Delete)
        CardRepository.delete.mockResolvedValue(true);
        const deleted = await CardService.delete(1);
        expect(deleted).toBe(true);
    });
});