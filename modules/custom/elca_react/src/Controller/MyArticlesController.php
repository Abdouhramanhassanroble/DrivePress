<?php

namespace Drupal\elca_react\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;

/**
 * Controller for "Mes articles" page.
 */
class MyArticlesController extends ControllerBase {

  /**
   * Builds the page content.
   */
  public function content(): array {
    $account = $this->currentUser();

    if ($account->isAnonymous()) {
      return [
        '#markup' => $this->t('Veuillez vous connecter pour voir vos articles.'),
        '#cache' => [
          'contexts' => ['user'],
        ],
      ];
    }

    $query = $this->entityTypeManager()->getStorage('node')->getQuery()
      ->accessCheck(TRUE)
      ->condition('type', 'article')
      ->condition('uid', (int) $account->id())
      ->sort('created', 'DESC')
      ->range(0, 50);
    $nids = $query->execute();

    $items = [];
    if (!empty($nids)) {
      $nodes = Node::loadMultiple($nids);
      foreach ($nodes as $node) {
        $items[] = [
          '#markup' => '<a class="user-profile-articles__link" href="' . $node->toUrl()->toString() . '">' . $node->label() . '</a>',
        ];
      }
    }

    if (empty($items)) {
      return [
        '#type' => 'container',
        '#attributes' => ['class' => ['user-profile-articles']],
        'empty' => ['#markup' => $this->t('Aucun article pour le moment.')],
        '#cache' => [
          'contexts' => ['user'],
        ],
      ];
    }

    return [
      '#type' => 'container',
      '#attributes' => ['class' => ['user-profile-articles']],
      'title' => [
        '#markup' => '<h2 class="user-profile-articles__title">' . $this->t('Mes articles') . '</h2>',
      ],
      'list' => [
        '#theme' => 'item_list',
        '#attributes' => ['class' => ['user-profile-articles__list']],
        '#items' => $items,
      ],
      '#cache' => [
        'contexts' => ['user'],
      ],
    ];
  }

}
