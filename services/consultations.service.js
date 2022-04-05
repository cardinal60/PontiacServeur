const {dbService} = require('./database.service');
const defaultConsultations = require('../data/DefaultConsultations.json');

const CONSULTATIONS_COLLECTION = "consultations";

class ConsultationService {
    constructor(){
        this.dbService = dbService;
    }


   /**
   * @returns la collection de Consultations de la BD
   */
    get collection() {
        return this.dbService.db.collection(CONSULTATIONS_COLLECTION);
  }

  /**
   * TODO : Récupérer toutes les recettes de la collection
   * @returns les consultation de la collection
   */
    async getAllConsultations() {return defaultConsultations.consultations};


    /**
   * TODO : Récupérer une consultation selon son id
   * @param {string} id : le id qui correspond à la consultation que l'on cherche
   * @returns la consultation correspondante
   */
    async getConsultationById(id) {
        return await this.collection.findOne({id : parseInt(id)});
    }

  /**
   * TODO : Supprimer la consultation de la collection en fonction de son id
   * @param {string} id : id de la consultation à supprimer
   * @returns le résultat de la modification
   */
    async deleteConsultationById(id) {
        await this.collection.deleteOne({id : parseInt(id)})
        return await this.getAllConsultations();
    }

    /**
   * TODO : Ajouter une Consultation à la liste des consultations
   * @param {*} consultation : la nouvelle recette à ajouter
   */
  async addNewConsultation(consultation) {await this.collection.insertOne(consultation);}

  /**
   * Réinitialiser les Consultations en supprimant la collection puis en la repeuplant
   */
    async resetConsultations() {
        await this.collection.deleteMany({});
        this.populateDb();
    }

    
     /**
   * Remplir la collection avec les recettes par défaut
   */
    async populateDb() {
        await this.dbService.populateDb(CONSULTATIONS_COLLECTION, defaultConsultations.consultations);
    }
}

module.exports = { ConsultationService };
    