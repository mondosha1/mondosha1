import { of } from '../../../util-core/src/lib'
import { sentence, sentenceFp } from './sentence.operator'

describe('Sentence', () => {
  describe('Sentence (deprecated)', () => {
    it('should make beautiful a sentence with only one element', () => {
      expect(sentence(['Donald'])).toBe('Donald')
    })

    it('should make beautiful a sentence with less than three elements', () => {
      expect(sentence(['Chip', 'Dale'])).toBe('Chip and Dale')
    })

    it('should make beautiful a sentence with an array of elements', () => {
      expect(sentence(['Huey', 'Dewey', 'Louie'])).toBe('Huey, Dewey and Louie')
    })

    it('should allow overriding the map iteratee', () => {
      expect(sentence([{ name: 'Huey' }, { name: 'Dewey' }, { name: 'Louie' }], 'name')).toBe('Huey, Dewey and Louie')
    })

    it('should allow overriding the separators', () => {
      expect(sentence(['Riri', 'Fifi', 'Loulou'], String, ', ', ' et ')).toBe('Riri, Fifi et Loulou')
    })
  })

  describe('SentenceFP', () => {
    it('should make beautiful a sentence with only one element', () => {
      expect(of(['Donald']).pipe(sentenceFp())).toBe('Donald')
    })

    it('should make beautiful a sentence with less than three elements', () => {
      expect(of(['Chip', 'Dale']).pipe(sentenceFp())).toBe('Chip and Dale')
    })

    it('should make beautiful a sentence with an array of elements', () => {
      expect(of(['Huey', 'Dewey', 'Louie']).pipe(sentenceFp())).toBe('Huey, Dewey and Louie')
    })

    it('should allow overriding the map iteratee', () => {
      expect(of([{ name: 'Huey' }, { name: 'Dewey' }, { name: 'Louie' }]).pipe(sentenceFp({ iteratee: 'name' }))).toBe(
        'Huey, Dewey and Louie'
      )
    })

    it('should allow overriding the separators', () => {
      expect(of(['Riri', 'Fifi', 'Loulou']).pipe(sentenceFp({ mainSeparator: ', ', secondarySeparator: ' et ' }))).toBe(
        'Riri, Fifi et Loulou'
      )
    })
  })
})
