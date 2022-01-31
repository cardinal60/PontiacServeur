const {dbService} = require('./database.service');
const defaultChapters = require('../data/DefaultChapters.json');

const CHAPTERS_COLLECTION = "chapters";

class ChaptersService {
    constructor(){
        this.dbService = dbService;
    }


   /**
   * @returns la collection de Consultations de la BD
   */
    get collection() {
        return this.dbService.db.collection(CHAPTERS_COLLECTION);
  }

  /**
   * TODO : Récupérer toutes les chapitres de la collection
   * @returns les chapitres de la collection
   */
    async getAllChapters() {return await this.collection.find({}).toArray();};

    /**
   * TODO : Récupérer toutes les chapitres d'une categorie de la collection
   * @param {string} id : le id qui correspond au chapitre que l'on cherche
   * @returns les chapitres de la collection
   */
     async getAllChaptersByCategory(category) {return await this.collection.find({category : category}).toArray();};

    /**
   * TODO : Récupérer un chapitre selon son id
   * @param {string} id : le id qui correspond au chapitre que l'on cherche
   * @returns la consultation correspondante
   */
    async getChapterById(id) {
        return await this.collection.findOne({id : parseInt(id)});
    }

  /**
   * TODO : Supprimer la consultation de la collection en fonction de son id
   * @param {string} id : id de la consultation à supprimer
   * @returns le résultat de la modification
   */
    async deleteChapterById(id) {
        await this.collection.deleteOne({id : parseInt(id)})
        return await this.getAllChapters();
    }

    /**
   * TODO : Ajouter une Consultation à la liste des consultations
   * @param {*} consultation : la nouvelle recette à ajouter
   */
  async addNewChapter(chapter) {await this.collection.insertOne(chapter);}

  /**
   * Réinitialiser les Consultations en supprimant la collection puis en la repeuplant
   */
    async resetChapters() {
        await this.collection.deleteMany({});
        this.populateDb();
    }

    
     /**
   * Remplir la collection avec les recettes par défaut
   */
    async populateDb() {
        await this.dbService.populateDb(CHAPTERS_COLLECTION, defaultChapters.chapters);
    }
}

module.exports = { ChaptersService };