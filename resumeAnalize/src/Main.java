/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package resumeanalize;

/**
 *
 * @author V  L  A  D
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
/*
        Ejobs parser = new Ejobs();
        parser.parse();*/
        Resume resume = new Resume();
        resume.analize(args[0]);
/*
        Analize analiza = new Analize();
        analiza.analize();*/
    }

}
