const consultationsRouter = require('express').Router();
const { HTTP_STATUS } = require('../utils/http');
const { ConsultationService } = require('../services/consultations.service');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-355jr2n8.us.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://pontiacvert.auth',
  issuer: `https://dev-355jr2n8.us.auth0.com/`,
  algorithms: ['RS256']
});

class ConsultationController {
  constructor() {
    this.ConsultationService = new ConsultationService();
    this.router = consultationsRouter;
    this.configureRouter();
  }

  /**
   * Configurer toutes les routes pour les recettes lors de l'initialisation
   */
  configureRouter() {
    /**
     * @returns toutes les recettes sauvegardées
     */
    this.router.get('/', async (req, res) => {
      const consultation = await this.ConsultationService.getAllConsultations();
      res.json(consultation);
    });
    
    /**
     * Renvoyer une recette spécifique selon un id
     * @returns la recette si le id existe. Sinon, le code d'erreur approprié
     */
    this.router.get('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const recipe = await this.ConsultationService.getConsultationById(id);
        if (!recipe) res.status(HTTP_STATUS.NOT_FOUND).send();
        else res.json(recipe);
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    //this.router.use(checkJwt);

    /**
     * Ajouter la nouvelle recette dans la BD
     */
    this.router.post('/', async (req, res) => {
      try {
        if (!Object.keys(req.body).length) {
          res.status(HTTP_STATUS.BAD_REQUEST).send();
          return;
        }
        const newConsultation = req.body;
        await this.ConsultationService.addNewConsultation(newConsultation);
        res.status(HTTP_STATUS.CREATED).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    

    /**
     * Supprimer une recette spécifique selon un id
     */
    this.router.delete('/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const deletedElement = await this.ConsultationService.deleteConsultationById(id);
        const status = deletedElement.value ? HTTP_STATUS.NO_CONTENT : HTTP_STATUS.NOT_FOUND;
        res.status(status).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });

    /**
     * Permet de remplacer la liste des recettes par la liste par défaut
     */
    this.router.patch('/admin/reset', async (req, res) => {
      try {
        await this.ConsultationService.resetConsultations();
        res.status(HTTP_STATUS.SUCCESS).send();
      } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).send();
      }
    });
  }
}
module.exports = { ConsultationController };